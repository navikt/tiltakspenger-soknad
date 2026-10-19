import { describe, expect, test } from '@jest/globals';
import { mocketTidligereSvar } from '@/mocks/mockedTidligereSøknad';
import { InnsendteSvar } from '@/types/InnsendteSvar';
import { endredeSvar, oppsummerSvar } from '@/utils/svaroppsummering';

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
