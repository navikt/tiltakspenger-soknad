import { beforeAll, describe, expect, jest, test } from '@jest/globals';
import defaultValues from '@/defaultValues';
import Spørsmålsbesvarelser from '@/types/Spørsmålsbesvarelser';
import { Tiltak } from '@/types/Tiltak';
import { Barn } from '@/types/Barn';
import { InnsendteSvar } from '@/types/InnsendteSvar';
import { mocketTidligereSvar } from '@/mocks/mockedTidligereSøknad';
import toSøknadJson from '@/utils/toSøknadJson';
import { endredeSvar, oppsummerSvar } from '@/utils/svaroppsummering';

// uuid er ren ESM og lar seg ikke laste av jest uten transformering.
jest.mock('uuid', () => {
    let teller = 0;
    return { v4: () => `uuid-${++teller}` };
});

let forhåndsutfyll: typeof import('./forhåndsutfylling').forhåndsutfyllFraForrigeSøknad;

beforeAll(async () => {
    forhåndsutfyll = (await import('./forhåndsutfylling')).forhåndsutfyllFraForrigeSøknad;
});

const tiltak = {
    aktivitetId: '45avk6',
    type: 'AVKLARAG',
    typeNavn: 'Avklaring',
    arenaRegistrertPeriode: { fra: '2025-03-01', til: '2025-06-30' },
    arrangør: 'Testarrangør D',
    gjennomforingId: '345678',
} as Tiltak;

const barnFraFolkeregisteret: Barn[] = [
    { uuid: 'ny-uuid-for-ola', fnr: '01012012345', fornavn: 'Ola', etternavn: 'Nordmann', fødselsdato: '2020-01-01' },
];

function innsendt(svar: Spørsmålsbesvarelser, barn?: Barn[]): InnsendteSvar {
    return JSON.parse(toSøknadJson(svar, barn, tiltak));
}

function skjemasvar(forrige: InnsendteSvar, barn?: Barn[]): Spørsmålsbesvarelser {
    const { barnetillegg, ...svar } = forhåndsutfyll(forrige, barn);
    return {
        ...defaultValues.svar,
        ...svar,
        tiltak: { aktivitetId: tiltak.aktivitetId, periode: forrige.tiltak.periode },
        barnetillegg: { ...barnetillegg, kladd: {} as Barn },
        harBekreftetAlleOpplysninger: true,
        harBekreftetÅSvareSåGodtManKan: true,
    } as Spørsmålsbesvarelser;
}

describe('forhåndsutfyllFraForrigeSøknad', () => {
    test('en søknad fylt ut med forrige svar har ingen endringer før bruker endrer noe', () => {
        const nå = innsendt(skjemasvar(mocketTidligereSvar));

        expect(endredeSvar(oppsummerSvar(nå), oppsummerSvar(mocketTidligereSvar))).toEqual([]);
        expect(nå.barnetillegg.manueltRegistrerteBarnSøktBarnetilleggFor).toEqual(
            mocketTidligereSvar.barnetillegg.manueltRegistrerteBarnSøktBarnetilleggFor.map((barn) => ({
                ...barn,
                mellomnavn: undefined,
            })),
        );
    });

    test('fyller ut bostedet til barna fra Folkeregisteret, kjent igjen på fødselsnummeret', () => {
        const forrige: InnsendteSvar = {
            ...mocketTidligereSvar,
            barnetillegg: {
                søkerOmBarnetillegg: true,
                manueltRegistrerteBarnSøktBarnetilleggFor: [],
                registrerteBarnSøktBarnetilleggFor: [
                    {
                        fnr: '01012012345',
                        fornavn: 'Ola',
                        etternavn: 'Nordmann',
                        fødselsdato: '2020-01-01',
                        oppholdssted: 'ANNET_EØS_LAND',
                    },
                ],
            },
        };

        const svar = skjemasvar(forrige, barnFraFolkeregisteret);

        expect(svar.barnetillegg.bostedForBarnFraFolkeregisteret).toEqual({
            'ny-uuid-for-ola': { borINorge: false, borIEøs: true },
        });
        expect(endredeSvar(oppsummerSvar(innsendt(svar, barnFraFolkeregisteret)), oppsummerSvar(forrige))).toEqual([]);
    });

    test('et endret svar gir en endring', () => {
        const svar = skjemasvar(mocketTidligereSvar);

        const endret = innsendt({ ...svar, sykepenger: { mottar: false } as Spørsmålsbesvarelser['sykepenger'] });

        expect(endredeSvar(oppsummerSvar(endret), oppsummerSvar(mocketTidligereSvar))).toEqual(['sykepenger']);
    });
});
