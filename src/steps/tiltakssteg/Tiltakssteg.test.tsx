/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/jest-globals';
import { beforeAll, describe, expect, jest, test } from '@jest/globals';
import { render, screen, within } from '@testing-library/react';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Søknad from '@/types/Søknad';
import defaultValues from '@/defaultValues';
import { Tiltak } from '@/types/Tiltak';
import { mocketTidligereSvar } from '@/mocks/mockedTidligereSøknad';

// Siden drar med seg serverkode. Steget trenger bare konteksten.
// Mockene heises ikke over importene når jest importeres fra @jest/globals, så modulene lastes dynamisk etterpå.
jest.mock('../../pages/utfylling/[[...step]]', () => ({
    UtfyllingContext: jest.requireActual<typeof import('react')>('react').createContext({}),
}));

let Tiltakssteg: typeof import('./Tiltakssteg').default;
let UtfyllingContext: typeof import('../../pages/utfylling/[[...step]]').UtfyllingContext;

beforeAll(async () => {
    Tiltakssteg = (await import('./Tiltakssteg')).default;
    UtfyllingContext = (await import('../../pages/utfylling/[[...step]]')).UtfyllingContext;
});

const SPØRSMÅL = 'Hvilket tiltak ønsker du å søke tiltakspenger for?';

function lagTiltak(aktivitetId: string, visningsnavn: string, tidligereSøknad?: Tiltak['tidligereSøknad']): Tiltak {
    return {
        aktivitetId,
        type: 'ARBTREN',
        typeNavn: 'Arbeidstrening',
        arenaRegistrertPeriode: { fra: '2025-01-01', til: '2025-03-31' },
        arrangør: 'Arrangør',
        gjennomforingId: 'g',
        visningsnavn,
        tidligereSøknad,
    };
}

function renderSteg(tiltak: Tiltak[]) {
    function Skjema() {
        const skjema = useForm<Søknad>({ defaultValues: defaultValues as unknown as Søknad });
        return (
            <UtfyllingContext value={{ tiltak }}>
                <FormProvider {...skjema}>
                    <Tiltakssteg title="Tiltak" stepNumber={1} onCompleted={jest.fn()} onGoToPreviousStep={jest.fn()} />
                </FormProvider>
            </UtfyllingContext>
        );
    }
    render(<Skjema />);
}

describe('Tiltakssteg', () => {
    test('merker tiltak bruker har søkt for med «Du har allerede søkt», og lar bruker velge det', () => {
        renderSteg([
            lagTiltak('1', 'Arbeidstrening hos A'),
            lagTiltak('2', 'Arbeidstrening hos B', { mottatt: '2025-01-15T10:30:00', svar: mocketTidligereSvar }),
        ]);

        const valg = within(screen.getByRole('radiogroup', { name: SPØRSMÅL })).getAllByRole('radio');
        expect(valg.map((radio) => radio.getAttribute('value'))).toEqual(['1', '2']);
        expect(screen.getByLabelText(/Arbeidstrening hos B.*Du har allerede søkt/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Arbeidstrening hos A/)).not.toHaveAccessibleName(/allerede søkt/);
        expect(screen.getAllByText('Du har allerede søkt')).toHaveLength(1);
    });

    test('viser utfallet for tiltak der forrige søknad er ferdig behandlet', () => {
        renderSteg([
            lagTiltak('1', 'Arbeidstrening hos A', {
                mottatt: '2025-01-15T10:30:00',
                svar: mocketTidligereSvar,
                behandlingsutfall: { resultat: 'INNVILGELSE', vedtakstidspunkt: '2025-02-01T12:00:00' },
            }),
            lagTiltak('2', 'Arbeidstrening hos B', {
                mottatt: '2025-01-15T10:30:00',
                svar: mocketTidligereSvar,
                behandlingsutfall: { resultat: 'AVSLAG', vedtakstidspunkt: '2025-02-01T12:00:00' },
            }),
        ]);

        expect(screen.getByLabelText(/Arbeidstrening hos A.*Søknaden din er innvilget/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Arbeidstrening hos B.*Søknaden din er avslått/)).toBeInTheDocument();
        expect(screen.queryByText('Du har allerede søkt')).not.toBeInTheDocument();
    });
});
