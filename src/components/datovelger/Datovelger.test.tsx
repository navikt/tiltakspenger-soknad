/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/jest-globals';
import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';
import Datovelger from './Datovelger';

const UGYLDIG_FORMAT = 'Fødselsdato er ugyldig. Bruk formatet dd.mm.åååå';

const renderDatovelger = (props?: Partial<React.ComponentProps<typeof Datovelger>>) => {
    const onDateChange = jest.fn();

    render(<Datovelger label="Fødselsdato" datoMåVæreIFortid onDateChange={onDateChange} {...props} />);

    const input = screen.getByLabelText('Fødselsdato');
    return {
        onDateChange,
        input,
        skriv: (verdi: string) => fireEvent.change(input, { target: { value: verdi } }),
        forlatFeltet: () => fireEvent.blur(input),
    };
};

describe('Datovelger', () => {
    test('sier ikke fra om ugyldig dato mens brukeren fortsatt skriver', () => {
        const { skriv } = renderDatovelger();

        skriv('0');
        skriv('01');
        skriv('01.0');

        expect(screen.queryByText(UGYLDIG_FORMAT)).not.toBeInTheDocument();
    });

    test('sier fra om ugyldig dato når feltet forlates', () => {
        const { skriv, forlatFeltet } = renderDatovelger();

        skriv('01.0');
        forlatFeltet();

        expect(screen.getByText(UGYLDIG_FORMAT)).toBeInTheDocument();
    });

    test('feilen forsvinner når datoen blir gyldig', () => {
        const { skriv, forlatFeltet, onDateChange } = renderDatovelger();

        skriv('01.0');
        forlatFeltet();
        skriv('01.02.2020');

        expect(screen.queryByText(UGYLDIG_FORMAT)).not.toBeInTheDocument();
        expect(onDateChange).toHaveBeenLastCalledWith(new Date(2020, 1, 1));
    });

    test('har skjemaet allerede meldt fra om feil, viser vi datofeilen uten å vente på blur', () => {
        // Trykker brukeren enter sendes skjemaet inn uten at feltet forlates. Da må den presise
        // feilmeldingen fram med en gang, ellers står de igjen med «du må oppgi fødselsdato»
        // mens det står tekst i feltet.
        const { skriv } = renderDatovelger({ errorMessage: 'Du må oppgi fødselsdato' });

        skriv('01.0');

        expect(screen.getByText(UGYLDIG_FORMAT)).toBeInTheDocument();
        expect(screen.queryByText('Du må oppgi fødselsdato')).not.toBeInTheDocument();
    });

    test('skjemafeilen vises når datoen i seg selv er i orden', () => {
        renderDatovelger({ errorMessage: 'Du må oppgi fødselsdato' });

        expect(screen.getByText('Du må oppgi fødselsdato')).toBeInTheDocument();
    });

    test('datoer som må ligge i fortid begrunnes med at de ikke kan være fram i tid', () => {
        const { skriv, forlatFeltet } = renderDatovelger();

        skriv('01.01.2099');
        forlatFeltet();

        expect(screen.getByText('Fødselsdato kan ikke være fram i tid')).toBeInTheDocument();
    });

    test('dato før minDate begrunnes med den tidligste gyldige datoen', () => {
        const { skriv, forlatFeltet } = renderDatovelger({ minDate: new Date(2001, 0, 1) });

        skriv('31.12.2000');
        forlatFeltet();

        expect(screen.getByText('Fødselsdato kan ikke være før 01.01.2001')).toBeInTheDocument();
    });

    test('id-en havner bare på inputen, ikke på DatePicker-wrapperen', () => {
        // Samme id begge steder ga duplikat-id i DOM og en aria-controls som pekte på seg selv.
        renderDatovelger({ id: 'svar.barnetillegg.kladd.fødselsdato' });

        const medId = document.querySelectorAll('[id="svar.barnetillegg.kladd.fødselsdato"]');
        expect(medId).toHaveLength(1);
        expect(medId[0].tagName).toBe('INPUT');
    });

    test('år- og månedsnedtrekk når begge grensene er kjent', () => {
        // Nedtrekket er hele poenget med grensene: uten fromDate returnerer Aksel ingen årsliste,
        // og brukeren må bla én måned av gangen tilbake til fødselsåret.
        renderDatovelger({ minDate: new Date(1926, 0, 1) });

        fireEvent.click(screen.getByRole('button', { name: 'Åpne datovelger' }));

        const årsvelger = screen.getByRole('combobox', { name: 'År' });
        expect(screen.getByRole('combobox', { name: 'Måned' })).toBeInTheDocument();
        // Hele vinduet skal ligge i lista, helt tilbake til den nedre grensen.
        expect(within(årsvelger).getByRole('option', { name: '1926' })).toBeInTheDocument();
    });

    test('kalenderFraDato korter ned årslista uten å stramme inn hva som godtas', () => {
        // Aksel bruker samme fromDate til begge deler, så uten dette skillet må et nedtrekk med
        // hundre årstall til for å godta hundre år tilbake.
        const { skriv, onDateChange } = renderDatovelger({
            minDate: new Date(1926, 0, 1),
            kalenderFraDato: new Date(2006, 0, 1),
        });

        fireEvent.click(screen.getByRole('button', { name: 'Åpne datovelger' }));
        const årsvelger = screen.getByRole('combobox', { name: 'År' });

        expect(within(årsvelger).getByRole('option', { name: '2006' })).toBeInTheDocument();
        expect(within(årsvelger).queryByRole('option', { name: '2005' })).not.toBeInTheDocument();
        expect(within(årsvelger).queryByRole('option', { name: '1926' })).not.toBeInTheDocument();

        // Et årstall utenfor nedtrekket skal fortsatt kunne skrives inn.
        skriv('01.02.1990');

        expect(onDateChange).toHaveBeenLastCalledWith(new Date(1990, 1, 1));
        expect(screen.queryByText(/kan ikke være før/)).not.toBeInTheDocument();
    });

    test('kalenderFraDato flytter ikke grensen for hva som er for gammelt', () => {
        const { skriv, forlatFeltet, onDateChange } = renderDatovelger({
            minDate: new Date(1926, 0, 1),
            kalenderFraDato: new Date(2006, 0, 1),
        });

        skriv('01.02.1925');
        forlatFeltet();

        expect(screen.getByText('Fødselsdato kan ikke være før 01.01.1926')).toBeInTheDocument();
        expect(onDateChange).toHaveBeenLastCalledWith(undefined);
    });

    test('uten nedre grense er det ingen årsliste å vise', () => {
        renderDatovelger();

        fireEvent.click(screen.getByRole('button', { name: 'Åpne datovelger' }));

        expect(screen.queryByRole('combobox', { name: 'År' })).not.toBeInTheDocument();
    });

    test('datoformatet står i description, ikke i labelen', () => {
        renderDatovelger({ description: 'Format: dd.mm.åååå' });

        expect(screen.getByLabelText('Fødselsdato')).toHaveAccessibleDescription('Format: dd.mm.åååå');
    });
});
