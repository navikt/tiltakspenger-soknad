import { describe, expect, test } from '@jest/globals';
import { harSvartPåBosted, tilOppholdssted } from './bosted';

describe('tilOppholdssted', () => {
    test('barn som bor i Norge', () => {
        expect(tilOppholdssted({ borINorge: true })).toBe('NORGE');
    });

    test('barn som bor i et annet EØS-land', () => {
        expect(tilOppholdssted({ borINorge: false, borIEøs: true })).toBe('ANNET_EØS_LAND');
    });

    test('barn som bor utenfor EØS', () => {
        expect(tilOppholdssted({ borINorge: false, borIEøs: false })).toBe('IKKE_EØS_LAND');
    });

    test('mangler svar når søkeren ikke har svart på begge trinnene', () => {
        expect(tilOppholdssted({})).toBeUndefined();
        expect(tilOppholdssted({ borINorge: false })).toBeUndefined();
        expect(harSvartPåBosted(undefined)).toBe(false);
        expect(harSvartPåBosted({ borINorge: false })).toBe(false);
        expect(harSvartPåBosted({ borINorge: true })).toBe(true);
    });
});
