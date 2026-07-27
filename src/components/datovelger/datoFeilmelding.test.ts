import { describe, expect, test } from '@jest/globals';
import { DateValidationT } from '@navikt/ds-react';
import { datoFeilmelding } from './datoFeilmelding';

// Aksel setter alle flaggene, så testene bygger på et gyldig utgangspunkt og skrur på ett om gangen.
const gyldig: DateValidationT = {
    isValidDate: true,
    isDisabled: false,
    isWeekend: false,
    isEmpty: false,
    isInvalid: false,
    isBefore: false,
    isAfter: false,
};

const ugyldig = (overstyr: Partial<DateValidationT>): DateValidationT => ({
    ...gyldig,
    isValidDate: false,
    ...overstyr,
});

const fødselsdato = { feltnavn: 'Fødselsdato' };

describe('datoFeilmelding', () => {
    test('ingen melding før datovelgeren har validert noe', () => {
        expect(datoFeilmelding(null, fødselsdato)).toBeUndefined();
    });

    test('ingen melding for gyldig dato', () => {
        expect(datoFeilmelding(gyldig, fødselsdato)).toBeUndefined();
    });

    test('tomt felt er påkrevd-validatorene sitt bord, ikke vårt', () => {
        expect(datoFeilmelding(ugyldig({ isEmpty: true }), fødselsdato)).toBeUndefined();
    });

    test('dato som ikke lar seg tolke gir formatet', () => {
        expect(datoFeilmelding(ugyldig({ isInvalid: true }), fødselsdato)).toBe(
            'Fødselsdato er ugyldig. Bruk formatet dd.mm.åååå',
        );
    });

    test('feltnavnet står først i meldingen', () => {
        expect(datoFeilmelding(ugyldig({ isInvalid: true }), { feltnavn: 'Fra-dato' })).toBe(
            'Fra-dato er ugyldig. Bruk formatet dd.mm.åååå',
        );
    });

    test('for sent: sier hvilken dato som er den siste gyldige', () => {
        expect(datoFeilmelding(ugyldig({ isAfter: true }), { ...fødselsdato, tilDato: new Date('2026-07-26') })).toBe(
            'Fødselsdato kan ikke være etter 26.07.2026',
        );
    });

    test('for tidlig: sier hvilken dato som er den første gyldige', () => {
        expect(datoFeilmelding(ugyldig({ isBefore: true }), { ...fødselsdato, fraDato: new Date('2001-01-01') })).toBe(
            'Fødselsdato kan ikke være før 01.01.2001',
        );
    });

    test('datoer som må ligge i fortid får en begrunnelse, ikke en tilfeldig dagens dato', () => {
        expect(
            datoFeilmelding(ugyldig({ isAfter: true }), {
                ...fødselsdato,
                tilDato: new Date('2026-07-26'),
                datoMåVæreIFortid: true,
            }),
        ).toBe('Fødselsdato kan ikke være fram i tid');
    });

    test('uten kjent grense sier vi bare at datoen er utenfor', () => {
        expect(datoFeilmelding(ugyldig({ isAfter: true }), fødselsdato)).toBe('Fødselsdato er utenfor gyldig periode');
        expect(datoFeilmelding(ugyldig({ isBefore: true }), fødselsdato)).toBe('Fødselsdato er utenfor gyldig periode');
    });

    test('helg og sperrede datoer får sin egen begrunnelse, ikke formatmeldingen', () => {
        expect(datoFeilmelding(ugyldig({ isWeekend: true }), fødselsdato)).toBe(
            'Fødselsdato kan ikke være en lørdag eller søndag',
        );
        expect(datoFeilmelding(ugyldig({ isDisabled: true }), fødselsdato)).toBe('Fødselsdato kan ikke velges');
    });

    test('grensen vinner over formatet når begge er brutt', () => {
        // useDatepicker setter isInvalid sammen med isBefore/isAfter, og da er grensen mest nyttig.
        expect(
            datoFeilmelding(ugyldig({ isInvalid: true, isBefore: true }), {
                ...fødselsdato,
                fraDato: new Date('2001-01-01'),
            }),
        ).toBe('Fødselsdato kan ikke være før 01.01.2001');
    });
});
