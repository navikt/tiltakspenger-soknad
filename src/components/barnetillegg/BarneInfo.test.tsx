/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/jest-globals';
import { describe, expect, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import React from 'react';
import BarneInfo from './BarneInfo';
import { Barn } from '@/types/Barn';

const barn: Barn = { uuid: 'kim', fnr: null, fødselsdato: '2018-03-04', borINorge: true };

function navnelinje() {
    return screen.getByText('Navn:').closest('p');
}

describe('BarneInfo', () => {
    test('viser hele navnet', () => {
        render(<BarneInfo barn={{ ...barn, fornavn: 'Kim', mellomnavn: 'Ola', etternavn: 'Gullaber' }} />);

        expect(navnelinje()).toHaveTextContent('Navn: Kim Ola Gullaber');
    });

    test('viser navnet selv om fornavnet mangler', () => {
        render(<BarneInfo barn={{ ...barn, etternavn: 'Gullaber' }} />);

        expect(navnelinje()).toHaveTextContent('Navn: Gullaber');
    });

    test('viser «Ukjent navn» når ingen deler av navnet er kjent', () => {
        render(<BarneInfo barn={{ ...barn, fornavn: '', mellomnavn: ' ' }} />);

        expect(navnelinje()).toHaveTextContent('Navn: Ukjent navn');
    });
});
