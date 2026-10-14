import { describe, expect, test } from '@jest/globals';
import { formaterBarnetsNavn, UKJENT_NAVN, visningsnavnForBarn } from './barnetsNavn';

describe('formaterBarnetsNavn', () => {
    test('setter sammen fornavn, mellomnavn og etternavn', () => {
        expect(formaterBarnetsNavn({ fornavn: 'Kim', mellomnavn: 'Ola', etternavn: 'Gullaber' })).toBe(
            'Kim Ola Gullaber',
        );
    });

    test.each([
        [{ fornavn: 'Kim' }, 'Kim'],
        [{ mellomnavn: 'Ola' }, 'Ola'],
        [{ etternavn: 'Gullaber' }, 'Gullaber'],
        [{ fornavn: 'Kim', etternavn: 'Gullaber' }, 'Kim Gullaber'],
        [{ mellomnavn: 'Ola', etternavn: 'Gullaber' }, 'Ola Gullaber'],
        [{ fornavn: null, mellomnavn: null, etternavn: 'Gullaber' }, 'Gullaber'],
        [{ fornavn: ' Kim ', mellomnavn: '  ', etternavn: 'Gullaber ' }, 'Kim Gullaber'],
    ])('bruker de delene som er kjent: %o', (barn, forventet) => {
        expect(formaterBarnetsNavn(barn)).toBe(forventet);
    });

    test.each([
        {},
        { fornavn: null, mellomnavn: null, etternavn: null },
        { fornavn: '', mellomnavn: ' ', etternavn: '\t' },
    ])('gir undefined når ingen deler av navnet er kjent: %o', (barn) => {
        expect(formaterBarnetsNavn(barn)).toBeUndefined();
    });
});

describe('visningsnavnForBarn', () => {
    test('viser navnet når noen del av det er kjent', () => {
        expect(visningsnavnForBarn({ etternavn: 'Gullaber' })).toBe('Gullaber');
    });

    test('viser «Ukjent navn» når ingen deler av navnet er kjent', () => {
        expect(UKJENT_NAVN).toBe('Ukjent navn');
        expect(visningsnavnForBarn({})).toBe('Ukjent navn');
        expect(visningsnavnForBarn({ fornavn: null, mellomnavn: '', etternavn: ' ' })).toBe('Ukjent navn');
    });
});
