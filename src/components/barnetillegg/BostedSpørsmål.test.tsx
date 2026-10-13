/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/jest-globals';
import { describe, expect, test } from '@jest/globals';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';
import { FieldValues, FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import BostedSpørsmål, { navnPåBarnet } from './BostedSpørsmål';

const NORGE = 'Bor Kim i Norge?';
const EØS = 'Bor Kim i et EØS-land?';

function renderBostedSpørsmål(skalValideres?: () => boolean) {
    let skjema: UseFormReturn<FieldValues> | undefined;
    function Skjema() {
        skjema = useForm<FieldValues>({ defaultValues: { bosted: {} } });
        return (
            <FormProvider {...skjema}>
                <BostedSpørsmål
                    barnetsNavn="Kim"
                    borINorgeName="bosted.borINorge"
                    borIEøsName="bosted.borIEøs"
                    skalValideres={skalValideres}
                />
            </FormProvider>
        );
    }
    render(<Skjema />);
    return {
        verdier: () => skjema!.getValues('bosted'),
        valider: () => act(() => skjema!.trigger()),
    };
}

function svar(spørsmål: string, svar: 'Ja' | 'Nei') {
    fireEvent.click(within(screen.getByRole('radiogroup', { name: spørsmål })).getByRole('radio', { name: svar }));
}

describe('BostedSpørsmål', () => {
    test('spør først bare om barnet bor i Norge', () => {
        renderBostedSpørsmål();

        expect(screen.getByRole('radiogroup', { name: NORGE })).toBeInTheDocument();
        expect(screen.queryByRole('radiogroup', { name: EØS })).not.toBeInTheDocument();
    });

    test('spør ikke om EØS når barnet bor i Norge', () => {
        const { verdier } = renderBostedSpørsmål();

        svar(NORGE, 'Ja');

        expect(screen.queryByRole('radiogroup', { name: EØS })).not.toBeInTheDocument();
        expect(verdier()).toEqual({ borINorge: true, borIEøs: undefined });
    });

    test('spør om EØS når barnet ikke bor i Norge', () => {
        const { verdier } = renderBostedSpørsmål();

        svar(NORGE, 'Nei');
        svar(EØS, 'Ja');

        expect(verdier()).toEqual({ borINorge: false, borIEøs: true });
    });

    test('nullstiller EØS-svaret når søkeren endrer svaret om Norge', () => {
        const { verdier } = renderBostedSpørsmål();

        svar(NORGE, 'Nei');
        svar(EØS, 'Nei');
        svar(NORGE, 'Ja');
        svar(NORGE, 'Nei');

        expect(verdier()).toEqual({ borINorge: false, borIEøs: undefined });
        const eøsSpørsmål = screen.getByRole('radiogroup', { name: EØS });
        expect(within(eøsSpørsmål).getByRole('radio', { name: 'Ja' })).not.toBeChecked();
        expect(within(eøsSpørsmål).getByRole('radio', { name: 'Nei' })).not.toBeChecked();
    });

    test('Ja står før Nei i begge spørsmålene, slik designet viser', () => {
        renderBostedSpørsmål();
        svar(NORGE, 'Nei');

        for (const spørsmål of [NORGE, EØS]) {
            const valg = within(screen.getByRole('radiogroup', { name: spørsmål })).getAllByRole('radio');
            expect(valg.map((radio) => radio.getAttribute('value'))).toEqual(['ja', 'nei']);
        }
    });

    test('krever svar på om barnet bor i Norge', async () => {
        const { valider } = renderBostedSpørsmål();

        await valider();

        expect(screen.getByText('Du må svare på om Kim bor i Norge')).toBeInTheDocument();
    });

    test('krever svar på EØS-spørsmålet når barnet ikke bor i Norge', async () => {
        const { valider } = renderBostedSpørsmål();
        svar(NORGE, 'Nei');

        await valider();

        expect(screen.queryByText('Du må svare på om Kim bor i Norge')).not.toBeInTheDocument();
        expect(screen.getByText('Du må svare på om Kim bor i et EØS-land')).toBeInTheDocument();
    });

    test('validerer ikke når skalValideres sier nei, slik som når modalen er lukket', async () => {
        const { valider } = renderBostedSpørsmål(() => false);
        svar(NORGE, 'Nei');

        await valider();

        expect(screen.queryByText(/Du må svare på/)).not.toBeInTheDocument();
    });
});

describe('navnPåBarnet', () => {
    test('setter sammen navnet og hopper over tomme deler', () => {
        expect(navnPåBarnet({ fornavn: 'Kim', mellomnavn: '', etternavn: 'Gullaber' })).toBe('Kim Gullaber');
        expect(navnPåBarnet({ fornavn: 'Kim', mellomnavn: 'Ola', etternavn: 'Gullaber' })).toBe('Kim Ola Gullaber');
    });

    test('bruker «barnet» når navnet mangler, slik som før søkeren har skrevet det inn i modalen', () => {
        expect(navnPåBarnet({})).toBe('barnet');
        expect(navnPåBarnet({ fornavn: '  ', etternavn: undefined })).toBe('barnet');
    });
});
