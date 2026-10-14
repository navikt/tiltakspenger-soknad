/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/jest-globals';
import { describe, expect, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { SlettBarnModal } from './SlettBarnModal';
import { Barn } from '@/types/Barn';

const barn: Barn = { uuid: 'kim', fnr: null, fødselsdato: '2018-03-04' };

function renderModal(navn: Partial<Barn>) {
    render(<SlettBarnModal barn={{ ...barn, ...navn }} onDelete={() => {}} />);
}

describe('SlettBarnModal', () => {
    test('nevner hele navnet på barnet', () => {
        renderModal({ fornavn: 'Kim', mellomnavn: 'Ola', etternavn: 'Gullaber' });

        expect(
            screen.getByText('Er du sikker på at du vil slette barnet Kim Ola Gullaber fra søknaden?'),
        ).toBeInTheDocument();
    });

    test('nevner de delene av navnet som er kjent', () => {
        renderModal({ etternavn: 'Gullaber' });

        expect(screen.getByText('Er du sikker på at du vil slette barnet Gullaber fra søknaden?')).toBeInTheDocument();
    });

    test('skriver ikke «undefined» når navnet mangler', () => {
        renderModal({});

        expect(screen.getByText('Er du sikker på at du vil slette barnet fra søknaden?')).toBeInTheDocument();
    });
});
