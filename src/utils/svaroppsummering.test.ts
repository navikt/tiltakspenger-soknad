import { describe, expect, test } from '@jest/globals';
import { mocketTidligereSvar } from '@/mocks/mockedTidligereSøknad';
import { InnsendteSvar } from '@/types/InnsendteSvar';
import { barnSøktBarnetilleggFor, endredeSvar, kortSvar, oppsummerSvar } from '@/utils/svaroppsummering';

const forrige = oppsummerSvar(mocketTidligereSvar);
const med = (endring: Partial<InnsendteSvar>) => oppsummerSvar({ ...mocketTidligereSvar, ...endring });

describe('endredeSvar', () => {
    test('like svar gir ingen endringer', () => {
        expect(endredeSvar(med({}), forrige)).toEqual([]);
    });

    test('en ny periode på et ja-svar er en endring', () => {
        const sykepenger = { mottar: true, periode: { fra: '2025-03-01', til: '2025-04-30' } };

        expect(endredeSvar(med({ sykepenger }), forrige)).toEqual(['sykepenger']);
    });

    test('spørsmålene om annen pengestøtte telles bare med når bruker svarte ja på at hen mottar det', () => {
        expect(endredeSvar(med({ jobbsjansen: { mottar: true, periode: null } }), forrige)).toEqual([]);
        expect(endredeSvar(med({ mottarAndreUtbetalinger: true }), forrige)).toEqual([
            'mottarAndreUtbetalinger',
            'gjenlevendepensjon',
            'alderspensjon',
            'supplerendestønadover67',
            'supplerendestønadflyktninger',
            'pensjonsordning',
            'jobbsjansen',
        ]);
    });

    test('rekkefølgen på barna er ikke en endring, men et nytt barn er det', () => {
        const kari = mocketTidligereSvar.barnetillegg.manueltRegistrerteBarnSøktBarnetilleggFor[0];
        const per = { ...kari, fornavn: 'Per', fødselsdato: '2022-01-01' };
        const medBarn = (...barn: (typeof kari)[]) =>
            oppsummerSvar({
                ...mocketTidligereSvar,
                barnetillegg: { ...mocketTidligereSvar.barnetillegg, manueltRegistrerteBarnSøktBarnetilleggFor: barn },
            });

        expect(endredeSvar(medBarn(per, kari), medBarn(kari, per))).toEqual([]);
        expect(endredeSvar(medBarn(kari, per), forrige)).toEqual(['barnetillegg']);
    });
});

describe('oppsummerSvar', () => {
    test('nevner tiltaksperioden bare én gang', () => {
        const svar = oppsummerSvar({ ...mocketTidligereSvar, etterlønn: { mottar: true } });

        expect(svar.etterlønn).toBe(
            'Ja, jeg mottar etterlønn fra en tidligere arbeidsgiver i perioden jeg går på tiltak',
        );
        expect(svar.mottarAndreUtbetalinger).toBe(
            'Nei, jeg mottar ikke annen pengestøtte i perioden jeg går på tiltak',
        );
    });
});

describe('barnSøktBarnetilleggFor', () => {
    test('viser ukjent navn for barn uten navn', () => {
        const barn = barnSøktBarnetilleggFor({
            ...mocketTidligereSvar,
            barnetillegg: {
                søkerOmBarnetillegg: true,
                registrerteBarnSøktBarnetilleggFor: [
                    { fnr: '01012550001', fornavn: null, etternavn: null, fødselsdato: '2025-01-01' },
                ],
                manueltRegistrerteBarnSøktBarnetilleggFor: [],
            },
        });

        expect(barn).toEqual(['Ukjent navn, født 01.01.2025']);
    });

    test('sorterer barna på fødselsdato, med det eldste først', () => {
        const barn = barnSøktBarnetilleggFor({
            ...mocketTidligereSvar,
            barnetillegg: {
                søkerOmBarnetillegg: true,
                registrerteBarnSøktBarnetilleggFor: [
                    { fnr: '01012550001', fornavn: 'Anna', etternavn: 'Nordmann', fødselsdato: '2025-01-01' },
                ],
                manueltRegistrerteBarnSøktBarnetilleggFor: [
                    { fornavn: 'Øyvind', etternavn: 'Nordmann', fødselsdato: '2018-06-30' },
                ],
            },
        });

        expect(barn).toEqual(['Øyvind Nordmann, født 30.06.2018', 'Anna Nordmann, født 01.01.2025']);
    });
});

describe('kortSvar', () => {
    test('viser bare Ja eller Nei, med perioden eller datoen ved ja', () => {
        const svar = kortSvar({
            ...mocketTidligereSvar,
            mottarAndreUtbetalinger: true,
            alderspensjon: { mottar: true, fraDato: '2025-04-01' },
        });

        expect(svar.sykepenger).toBe('Ja, 01.03.2025 - 31.03.2025');
        expect(svar.alderspensjon).toBe('Ja, fra 01.04.2025');
        expect(svar.etterlønn).toBe('Nei');
        expect(svar.barnetillegg).toBe('Ja');
    });

    test('spørsmål som ikke ble stilt har ikke noe svar', () => {
        expect(kortSvar(mocketTidligereSvar).jobbsjansen).toBeUndefined();
    });
});
