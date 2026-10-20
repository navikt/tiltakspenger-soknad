/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/jest-globals';
import { beforeAll, describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import React from 'react';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import Søknad from '@/types/Søknad';
import defaultValues from '@/defaultValues';

// Siden drar med seg serverkode. Steget trenger bare konteksten.
// Mockene heises ikke over importene når jest importeres fra @jest/globals, så modulene lastes dynamisk etterpå.
jest.mock('../../pages/utfylling/[[...step]]', () => ({
    UtfyllingContext: jest.requireActual<typeof import('react')>('react').createContext({}),
}));

let BarnetilleggSteg: typeof import('./BarnetilleggSteg').default;

beforeAll(async () => {
    BarnetilleggSteg = (await import('./BarnetilleggSteg')).default;
});

const SPØRSMÅL = 'Har du barn du vil søke barnetillegg for?';

function renderSteg() {
    const onCompleted = jest.fn();
    const onGoToPreviousStep = jest.fn();
    let skjema: UseFormReturn<Søknad> | undefined;
    function Skjema() {
        skjema = useForm<Søknad>({ defaultValues: defaultValues as unknown as Søknad });
        return (
            <FormProvider {...skjema}>
                <BarnetilleggSteg
                    title="Barnetillegg"
                    stepNumber={5}
                    onCompleted={onCompleted}
                    onGoToPreviousStep={onGoToPreviousStep}
                />
            </FormProvider>
        );
    }
    render(<Skjema />);
    return { onCompleted, onGoToPreviousStep, skjema: () => skjema! };
}

function svar(verdi: 'Ja' | 'Nei') {
    fireEvent.click(within(screen.getByRole('radiogroup', { name: SPØRSMÅL })).getByRole('radio', { name: verdi }));
}

describe('BarnetilleggSteg', () => {
    test('spør om søkeren har barn hen vil søke barnetillegg for, uten å vise noen barn', () => {
        renderSteg();

        expect(screen.getByRole('radiogroup', { name: SPØRSMÅL })).toBeInTheDocument();
        expect(screen.queryByText(/Barn som vi har funnet registrert på deg/)).not.toBeInTheDocument();
    });

    test('Ja står før Nei', () => {
        renderSteg();

        const valg = within(screen.getByRole('radiogroup', { name: SPØRSMÅL })).getAllByRole('radio');
        expect(valg.map((radio) => radio.getAttribute('value'))).toEqual(['ja', 'nei']);
    });

    test('kan ikke gå videre uten å svare', async () => {
        const { onCompleted } = renderSteg();

        fireEvent.click(screen.getByRole('button', { name: 'Neste steg' }));

        expect(
            await screen.findByText('Du må svare på om du har barn du vil søke barnetillegg for'),
        ).toBeInTheDocument();
        expect(onCompleted).not.toHaveBeenCalled();
    });

    test.each([
        ['Ja', true],
        ['Nei', false],
    ] as const)('lagrer svaret %s og går videre', async (verdi, forventet) => {
        const { onCompleted, skjema } = renderSteg();

        svar(verdi);
        fireEvent.click(screen.getByRole('button', { name: 'Neste steg' }));

        await waitFor(() => expect(onCompleted).toHaveBeenCalledTimes(1));
        expect(skjema().getValues('svar.barnetillegg.søkerOmBarnetillegg')).toBe(forventet);
    });

    test('går tilbake med Forrige steg', () => {
        const { onGoToPreviousStep } = renderSteg();

        fireEvent.click(screen.getByRole('button', { name: 'Forrige steg' }));

        expect(onGoToPreviousStep).toHaveBeenCalledTimes(1);
    });
});
