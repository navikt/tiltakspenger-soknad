import { beforeAll, describe, expect, jest, test } from '@jest/globals';
import defaultValues from '@/defaultValues';
import Spørsmålsbesvarelser from '@/types/Spørsmålsbesvarelser';
import { Tiltak } from '@/types/Tiltak';
import { Barn } from '@/types/Barn';
import { InnsendteSvar } from '@/types/InnsendteSvar';
import toSøknadJson from '@/utils/toSøknadJson';

// uuid er ren ESM og lar seg ikke laste av jest uten transformering.
jest.mock('uuid', () => {
    let teller = 0;
    return { v4: () => `uuid-${++teller}` };
});

let forhåndsutfyll: typeof import('@/utils/forhåndsutfylling').forhåndsutfyllFraForrigeSøknad;
let demo: typeof import('./demoInnsendinger');
let mockedBarn: Barn[];
let DEMO_TIDLIGERE_SØKNAD: typeof import('./demo').DEMO_TIDLIGERE_SØKNAD;
let DEMO_SESJON_COOKIE: string;
let DEMO_TIDLIGERE_SØKNAD_COOKIE: string;
let DEMO_TIDLIGERE_SØKNAD_RESULTAT_COOKIE: string;

beforeAll(async () => {
    forhåndsutfyll = (await import('@/utils/forhåndsutfylling')).forhåndsutfyllFraForrigeSøknad;
    demo = await import('./demoInnsendinger');
    mockedBarn = (await import('./mockedPersonalia')).mockedBarn;
    ({
        DEMO_TIDLIGERE_SØKNAD,
        DEMO_SESJON_COOKIE,
        DEMO_TIDLIGERE_SØKNAD_COOKIE,
        DEMO_TIDLIGERE_SØKNAD_RESULTAT_COOKIE,
    } = await import('./demo'));
});

const tiltak = { aktivitetId: '45avk6' } as Tiltak;

/** Svarene en bruker sender inn uten å endre noe i en søknad fylt ut med forrige svar. */
function sendUendret(forrige: InnsendteSvar): InnsendteSvar {
    // Barna fra Folkeregisteret får nye uuid-er ved hver henting.
    const barn = mockedBarn.map((b, i) => ({ ...b, uuid: `hentet-${i}` }));
    const { barnetillegg, ...svar } = forhåndsutfyll(forrige, barn);
    const skjemasvar = {
        ...defaultValues.svar,
        ...svar,
        tiltak: { aktivitetId: tiltak.aktivitetId, periode: forrige.tiltak.periode },
        barnetillegg: { ...barnetillegg, kladd: {} as Barn },
    } as Spørsmålsbesvarelser;
    return { ...JSON.parse(toSøknadJson(skjemasvar, barn, tiltak)), tiltak: forrige.tiltak };
}

describe('mottaDemosøknad', () => {
    test('den valgte tidligere søknaden kan sendes til siden som JSON', () => {
        expect(JSON.parse(JSON.stringify(DEMO_TIDLIGERE_SØKNAD))).toStrictEqual(DEMO_TIDLIGERE_SØKNAD);
    });

    test('avviser den valgte tidligere søknaden når den sendes inn på nytt uten endringer', () => {
        const cookies = { [DEMO_TIDLIGERE_SØKNAD_COOKIE]: 'true' };

        expect(demo.mottaDemosøknad(cookies, sendUendret(DEMO_TIDLIGERE_SØKNAD.svar))).toEqual({
            type: 'utenEndringer',
            mottatt: DEMO_TIDLIGERE_SØKNAD.mottatt,
        });
    });

    test('den valgte tidligere søknaden er under behandling når det ikke er valgt noe gyldig resultat', () => {
        ['UNDER_BEHANDLING', 'UKJENT', undefined].forEach((resultat) => {
            const cookies = {
                [DEMO_TIDLIGERE_SØKNAD_COOKIE]: 'true',
                [DEMO_TIDLIGERE_SØKNAD_RESULTAT_COOKIE]: resultat,
            };

            expect(demo.tidligereSøknaderIDemo(cookies)[tiltak.aktivitetId].behandlingsutfall).toBeNull();
        });
    });

    test('tar imot den valgte tidligere søknaden uten endringer når den er ferdig behandlet eller avbrutt', () => {
        (['INNVILGELSE', 'AVSLAG', 'AVBRUTT'] as const).forEach((resultat) => {
            const cookies = {
                [DEMO_TIDLIGERE_SØKNAD_COOKIE]: 'true',
                [DEMO_TIDLIGERE_SØKNAD_RESULTAT_COOKIE]: resultat,
                [DEMO_SESJON_COOKIE]: `sesjon-${resultat}`,
            };

            expect(demo.tidligereSøknaderIDemo(cookies)[tiltak.aktivitetId].behandlingsutfall).toEqual({
                resultat,
                tidspunkt: '2025-04-10T09:00:00',
            });
            expect(demo.mottaDemosøknad(cookies, sendUendret(DEMO_TIDLIGERE_SØKNAD.svar))).toEqual({
                type: 'mottatt',
                mottatt: expect.any(String),
            });
        });
    });

    test('husker søknader sendt inn i demoen, og avviser dem når de sendes inn på nytt uten endringer', () => {
        const svar = DEMO_TIDLIGERE_SØKNAD.svar;
        const første = demo.mottaDemosøknad({}, svar, new Date('2026-10-20T12:00:00Z'));
        expect(første).toEqual({ type: 'mottatt', mottatt: '2026-10-20T12:00:00.000Z', nySesjon: expect.any(String) });

        const cookies = { [DEMO_SESJON_COOKIE]: (første as { nySesjon: string }).nySesjon };
        expect(demo.tidligereSøknaderIDemo(cookies)[tiltak.aktivitetId]).toEqual({ mottatt: første.mottatt, svar });
        expect(demo.mottaDemosøknad(cookies, sendUendret(svar))).toEqual({
            type: 'utenEndringer',
            mottatt: første.mottatt,
        });

        const endret = { ...svar, etterlønn: { mottar: true } };
        expect(demo.mottaDemosøknad(cookies, endret)).toEqual({ type: 'mottatt', mottatt: expect.any(String) });
        expect(demo.tidligereSøknaderIDemo(cookies)[tiltak.aktivitetId].svar).toEqual(endret);
    });

    test('en ny demosesjon har ingen tidligere søknader', () => {
        demo.mottaDemosøknad({ [DEMO_SESJON_COOKIE]: 'en-sesjon' }, DEMO_TIDLIGERE_SØKNAD.svar);

        expect(demo.tidligereSøknaderIDemo({ [DEMO_SESJON_COOKIE]: 'en-annen-sesjon' })).toEqual({});
    });
});
