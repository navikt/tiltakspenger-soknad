/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/jest-globals';
import { beforeAll, describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Søknad from '@/types/Søknad';
import defaultValues from '@/defaultValues';
import { Tiltak } from '@/types/Tiltak';
import { ETTERSENDING_URL, MIN_SIDE_URL } from '@/utils/lenker';
import { mocketTidligereSvar } from '@/mocks/mockedTidligereSøknad';

// Siden drar med seg serverkode. Steget trenger bare konteksten.
// Mockene heises ikke over importene når jest importeres fra @jest/globals, så modulene lastes dynamisk etterpå.
jest.mock('../../pages/utfylling/[[...step]]', () => ({
    UtfyllingContext: jest.requireActual<typeof import('react')>('react').createContext({}),
}));

let TidligereSøknadSteg: typeof import('./TidligereSøknadSteg').default;
let UtfyllingContext: typeof import('../../pages/utfylling/[[...step]]').UtfyllingContext;

beforeAll(async () => {
    TidligereSøknadSteg = (await import('./TidligereSøknadSteg')).default;
    UtfyllingContext = (await import('../../pages/utfylling/[[...step]]')).UtfyllingContext;
});

const valgtTiltak: Tiltak = {
    aktivitetId: '45avk6',
    type: 'AVKLARAG',
    typeNavn: 'Avklaring',
    arenaRegistrertPeriode: { fra: '2025-03-01', til: '2025-06-30' },
    arrangør: 'Testarrangør D',
    gjennomforingId: '345678',
    visningsnavn: 'Avklaring hos Testarrangør D',
    tidligereSøknad: { mottatt: '2025-03-03T10:15:00', svar: mocketTidligereSvar },
};

function renderSteg(onCompleted: () => void, tiltak: Tiltak = valgtTiltak) {
    function Skjema() {
        const skjema = useForm<Søknad>({ defaultValues: defaultValues as unknown as Søknad });
        return (
            <UtfyllingContext value={{ valgtTiltak: tiltak }}>
                <FormProvider {...skjema}>
                    <TidligereSøknadSteg
                        title="Du har allerede søkt for dette tiltaket"
                        stepNumber={1}
                        onCompleted={onCompleted}
                        onGoToPreviousStep={jest.fn()}
                    />
                </FormProvider>
            </UtfyllingContext>
        );
    }
    render(<Skjema />);
}

describe('TidligereSøknadSteg', () => {
    test('viser når vi mottok søknaden, lenke til ettersending og svarene fra forrige søknad', () => {
        renderSteg(jest.fn());

        expect(
            screen.getByText(
                /Vi mottok søknaden din 3\. mars 2025, klokken 10\.15, for tiltaket Avklaring hos Testarrangør D\./,
            ),
        ).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /ettersende dem/ })).toHaveAttribute('href', ETTERSENDING_URL);
        expect(screen.getByText('01.03.2025 - 30.06.2025')).toBeInTheDocument();
        expect(
            screen.getByText(/Ja, jeg mottar sykepenger i perioden 01\.03\.2025 - 31\.03\.2025/),
        ).toBeInTheDocument();
        expect(
            within(screen.getByRole('list')).getByText('Kari Nordmann, født 17.05.2020, bor i Norge'),
        ).toBeInTheDocument();
        // Spørsmålene under annen pengestøtte ble ikke stilt, siden bruker svarte nei.
        expect(screen.queryByText('Alderspensjon')).not.toBeInTheDocument();
    });

    test('viser utfallet når forrige søknad er ferdig behandlet, uten krav om å endre svar', () => {
        renderSteg(jest.fn(), {
            ...valgtTiltak,
            tidligereSøknad: {
                ...valgtTiltak.tidligereSøknad!,
                behandlingsutfall: { resultat: 'AVSLAG', tidspunkt: '2025-04-10T09:00:00' },
            },
        });

        expect(screen.getByText('Søknaden din for dette tiltaket er ferdig behandlet')).toBeInTheDocument();
        expect(screen.getByText(/Søknaden ble avslått 10\. april 2025\./)).toBeInTheDocument();
        expect(screen.getByText(/Du kan se vedtaksbrevet på/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Min side/ })).toHaveAttribute('href', MIN_SIDE_URL);
        expect(screen.queryByText(/du må endre minst ett svar/)).not.toBeInTheDocument();
    });

    test('viser at forrige søknad er avbrutt, uten krav om å endre svar', () => {
        renderSteg(jest.fn(), {
            ...valgtTiltak,
            tidligereSøknad: {
                ...valgtTiltak.tidligereSøknad!,
                behandlingsutfall: { resultat: 'AVBRUTT', tidspunkt: '2025-04-10T09:00:00' },
            },
        });

        expect(screen.getByText('Søknaden din for dette tiltaket er avbrutt')).toBeInTheDocument();
        expect(screen.getByText(/Søknaden ble avbrutt 10\. april 2025\./)).toBeInTheDocument();
        // En avbrutt søknad har ikke noe vedtak, og dermed ikke noe vedtaksbrev.
        expect(screen.queryByText(/vedtaksbrevet/)).not.toBeInTheDocument();
        expect(screen.queryByText(/du må endre minst ett svar/)).not.toBeInTheDocument();
    });

    test('krever endrede svar når forrige søknad ikke er ferdig behandlet', () => {
        renderSteg(jest.fn());

        expect(screen.getByText('Vi har mottatt søknaden din for dette tiltaket')).toBeInTheDocument();
        expect(screen.getByText(/du må endre minst ett svar/)).toBeInTheDocument();
        expect(screen.queryByText(/vedtaksbrevet/)).not.toBeInTheDocument();
    });

    test('Start ny søknad går videre', async () => {
        const onCompleted = jest.fn();
        renderSteg(onCompleted);

        fireEvent.click(screen.getByRole('button', { name: 'Start ny søknad' }));

        await waitFor(() => expect(onCompleted).toHaveBeenCalled());
    });
});
