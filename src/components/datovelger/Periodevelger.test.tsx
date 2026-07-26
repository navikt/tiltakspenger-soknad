/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/jest-globals';
import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import Periodevelger from './Periodevelger';

const FRA_UGYLDIG = 'Fra-dato er ugyldig. Bruk formatet dd.mm.åååå';
const TIL_UGYLDIG = 'Til-dato er ugyldig. Bruk formatet dd.mm.åååå';

const renderPeriodevelger = (props?: Partial<React.ComponentProps<typeof Periodevelger>>) => {
    const onFromChange = jest.fn();
    const onToChange = jest.fn();

    render(<Periodevelger id="periode" onFromChange={onFromChange} onToChange={onToChange} {...props} />);

    const fra = screen.getByLabelText('Fra');
    const til = screen.getByLabelText('Til');
    const skrivOgForlat = (felt: HTMLElement, verdi: string) => {
        fireEvent.change(felt, { target: { value: verdi } });
        fireEvent.blur(felt);
    };

    return { onFromChange, onToChange, fra, til, skrivOgForlat };
};

describe('Periodevelger', () => {
    test('sier ikke fra om ugyldig dato mens brukeren fortsatt skriver', () => {
        const { fra } = renderPeriodevelger();

        fireEvent.change(fra, { target: { value: '0' } });
        fireEvent.change(fra, { target: { value: '01.0' } });

        expect(screen.queryByText(FRA_UGYLDIG)).not.toBeInTheDocument();
    });

    test('bare feltet som faktisk er feil blir markert', () => {
        const { fra, til, skrivOgForlat } = renderPeriodevelger();

        skrivOgForlat(fra, '01.0');

        expect(screen.getByText(FRA_UGYLDIG)).toBeInTheDocument();
        expect(fra).toHaveAttribute('aria-invalid', 'true');
        expect(til).not.toHaveAttribute('aria-invalid');
    });

    test('begge feilene vises når begge feltene er feil', () => {
        const { fra, til, skrivOgForlat } = renderPeriodevelger();

        skrivOgForlat(fra, '01.0');
        skrivOgForlat(til, '32.13.2026');

        expect(screen.getByText(FRA_UGYLDIG)).toBeInTheDocument();
        expect(screen.getByText(TIL_UGYLDIG)).toBeInTheDocument();
    });

    test('skjemafeilen gjelder perioden, og markerer derfor begge feltene', () => {
        const { fra, til } = renderPeriodevelger({ errorMessage: 'Du må oppgi når du mottok sykepenger' });

        expect(screen.getByText('Du må oppgi når du mottok sykepenger')).toBeInTheDocument();
        expect(fra).toHaveAttribute('aria-invalid', 'true');
        expect(til).toHaveAttribute('aria-invalid', 'true');
    });

    test('feilmeldingen er koblet til begge feltene, og fortrenger ikke datoformatet', () => {
        // Meldingen ligger utenfor feltene, så uten koblingen når den ikke skjermlesere.
        const { fra, til, skrivOgForlat } = renderPeriodevelger();

        skrivOgForlat(fra, '01.0');

        expect(fra).toHaveAccessibleDescription(`${FRA_UGYLDIG} Format: dd.mm.åååå`);
        expect(til).toHaveAccessibleDescription(`${FRA_UGYLDIG} Format: dd.mm.åååå`);
    });

    test('feilmeldingen ligger i en live-region så den blir lest opp når den dukker opp', () => {
        const { fra, skrivOgForlat } = renderPeriodevelger();

        skrivOgForlat(fra, '01.0');

        expect(document.getElementById('periode-feilmelding')).toHaveAttribute('aria-live', 'polite');
    });

    test('dato utenfor perioden begrunnes med grensen som gjelder', () => {
        const { fra, til, skrivOgForlat } = renderPeriodevelger({
            minDate: new Date(2026, 1, 1),
            maxDate: new Date(2026, 5, 30),
        });

        skrivOgForlat(fra, '31.01.2026');
        skrivOgForlat(til, '01.07.2026');

        expect(screen.getByText('Fra-dato kan ikke være før 01.02.2026')).toBeInTheDocument();
        expect(screen.getByText('Til-dato kan ikke være etter 30.06.2026')).toBeInTheDocument();
    });

    test('feilen forsvinner når datoen blir gyldig', () => {
        const { fra, til, onFromChange, skrivOgForlat } = renderPeriodevelger();

        skrivOgForlat(fra, '01.0');
        skrivOgForlat(fra, '01.02.2026');

        expect(screen.queryByText(FRA_UGYLDIG)).not.toBeInTheDocument();
        expect(fra).not.toHaveAttribute('aria-invalid');
        expect(til).not.toHaveAttribute('aria-invalid');
        expect(onFromChange).toHaveBeenLastCalledWith(new Date(2026, 1, 1));
    });

    test('feltene får hver sin id, ikke samme id som wrapperen', () => {
        const { fra, til } = renderPeriodevelger();

        expect(fra).toHaveAttribute('id', 'periode.fra');
        expect(til).toHaveAttribute('id', 'periode.til');
        expect(document.querySelectorAll('[id="periode"]')).toHaveLength(0);
    });
});
