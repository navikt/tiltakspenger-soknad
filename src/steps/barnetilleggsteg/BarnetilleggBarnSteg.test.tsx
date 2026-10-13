/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/jest-globals';
import { beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import React, { useState } from 'react';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import Søknad from '@/types/Søknad';
import { Barn } from '@/types/Barn';
import { Personalia } from '@/types/Personalia';
import defaultValues from '@/defaultValues';

// Sidene drar med seg serverkode. Stegene trenger bare kontekstene.
// Mockene heises ikke over importene når jest importeres fra @jest/globals, så modulene lastes dynamisk etterpå.
jest.mock('../../pages/utfylling/[[...step]]', () => ({
    UtfyllingContext: jest.requireActual<typeof import('react')>('react').createContext({}),
}));
jest.mock('../../pages/_app', () => ({
    UtfyllingSetStateContext: jest.requireActual<typeof import('react')>('react').createContext({}),
}));
jest.mock('../../utils/hentBarn', () => ({ hentBarnFraFolkeregisteret: jest.fn() }));
// uuid er ren ESM og lar seg ikke laste av jest uten transformering.
jest.mock('uuid', () => {
    let teller = 0;
    return { v4: () => `uuid-${++teller}` };
});

let BarnetilleggBarnSteg: typeof import('./BarnetilleggBarnSteg').default;
let UtfyllingContext: typeof import('../../pages/utfylling/[[...step]]').UtfyllingContext;
let UtfyllingSetStateContext: typeof import('../../pages/_app').UtfyllingSetStateContext;
let hentBarnMock: jest.MockedFunction<typeof import('../../utils/hentBarn').hentBarnFraFolkeregisteret>;

const KIM: Barn = { uuid: 'kim', fnr: '12345678910', fornavn: 'Kim', etternavn: 'Gullaber', fødselsdato: '2018-03-04' };
const TRULTE: Barn = {
    uuid: 'trulte',
    fnr: '10987654321',
    fornavn: 'Trulte',
    etternavn: 'Syltestrikk',
    fødselsdato: '2021-02-02',
};

const personaliaUtenBarn: Personalia = {
    fornavn: 'Test',
    etternavn: 'Testesen',
    fødselsnummer: '01019012345',
    harFylt18År: true,
};

const INGEN_BARN_FEIL = /Du har ikke lagt til noen barn/;

beforeAll(async () => {
    BarnetilleggBarnSteg = (await import('./BarnetilleggBarnSteg')).default;
    UtfyllingContext = (await import('../../pages/utfylling/[[...step]]')).UtfyllingContext;
    UtfyllingSetStateContext = (await import('../../pages/_app')).UtfyllingSetStateContext;
    hentBarnMock = jest.mocked((await import('../../utils/hentBarn')).hentBarnFraFolkeregisteret);
    // jsdom mangler dialog-API-et som Aksels Modal bruker.
    HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
        this.setAttribute('open', '');
    };
    HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
        this.removeAttribute('open');
    };
});

beforeEach(() => {
    hentBarnMock.mockReset();
});

function renderSteg({
    personalia: startPersonalia = personaliaUtenBarn,
    manueltRegistrerteBarn = [],
}: { personalia?: Personalia; manueltRegistrerteBarn?: Barn[] } = {}) {
    const onCompleted = jest.fn();
    let skjema: UseFormReturn<Søknad> | undefined;
    let gjeldendePersonalia: Personalia | undefined;
    function Utfylling() {
        const [personalia, setPersonalia] = useState<Personalia | undefined>(startPersonalia);
        gjeldendePersonalia = personalia;
        skjema = useForm<Søknad>({
            defaultValues: {
                ...defaultValues,
                svar: {
                    ...defaultValues.svar,
                    barnetillegg: {
                        ...defaultValues.svar.barnetillegg,
                        søkerOmBarnetillegg: true,
                        manueltRegistrerteBarnSøktBarnetilleggFor: manueltRegistrerteBarn,
                    },
                },
            } as unknown as Søknad,
        });
        return (
            <UtfyllingSetStateContext value={{ setPersonalia }}>
                <UtfyllingContext value={{ personalia }}>
                    <FormProvider {...skjema}>
                        <BarnetilleggBarnSteg
                            title="Barnetillegg"
                            stepNumber={5}
                            onCompleted={onCompleted}
                            onGoToPreviousStep={() => {}}
                        />
                    </FormProvider>
                </UtfyllingContext>
            </UtfyllingSetStateContext>
        );
    }
    render(<Utfylling />);
    return { onCompleted, skjema: () => skjema!, personalia: () => gjeldendePersonalia };
}

function svar(spørsmål: string, verdi: 'Ja' | 'Nei', inni: HTMLElement = document.body) {
    fireEvent.click(
        within(within(inni).getByRole('radiogroup', { name: spørsmål })).getByRole('radio', { name: verdi }),
    );
}

function gåVidere() {
    fireEvent.click(screen.getByRole('button', { name: 'Neste steg' }));
}

describe('BarnetilleggBarnSteg', () => {
    test('henter barna fra Folkeregisteret og viser bostedsspørsmål for hvert barn', async () => {
        hentBarnMock.mockResolvedValue([KIM, TRULTE]);
        const { personalia } = renderSteg();

        expect(screen.getByText('Henter barn fra Folkeregisteret')).toBeInTheDocument();
        expect(await screen.findByRole('radiogroup', { name: 'Bor Kim Gullaber i Norge?' })).toBeInTheDocument();
        expect(screen.getByRole('radiogroup', { name: 'Bor Trulte Syltestrikk i Norge?' })).toBeInTheDocument();
        expect(hentBarnMock).toHaveBeenCalledTimes(1);
        expect(personalia()?.barn).toEqual([KIM, TRULTE]);
    });

    test('henter ikke barna på nytt når de allerede er hentet', async () => {
        renderSteg({ personalia: { ...personaliaUtenBarn, barn: [KIM] } });

        expect(screen.getByRole('radiogroup', { name: 'Bor Kim Gullaber i Norge?' })).toBeInTheDocument();
        expect(hentBarnMock).not.toHaveBeenCalled();
    });

    test('viser feil og lar søkeren prøve igjen når hentingen feiler', async () => {
        hentBarnMock.mockRejectedValueOnce(new Error('nede')).mockResolvedValueOnce([KIM]);
        renderSteg();

        expect(await screen.findByText('Vi klarte ikke å hente barna dine fra Folkeregisteret.')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Prøv igjen' }));

        expect(await screen.findByRole('radiogroup', { name: 'Bor Kim Gullaber i Norge?' })).toBeInTheDocument();
        expect(screen.queryByText('Vi klarte ikke å hente barna dine fra Folkeregisteret.')).not.toBeInTheDocument();
        expect(hentBarnMock).toHaveBeenCalledTimes(2);
    });

    test('går ikke videre mens barna hentes', async () => {
        hentBarnMock.mockReturnValue(new Promise(() => {}));
        const { onCompleted } = renderSteg();

        gåVidere();

        await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
        expect(onCompleted).not.toHaveBeenCalled();
        expect(screen.queryByText(INGEN_BARN_FEIL)).not.toBeInTheDocument();
    });

    test('krever svar på bosted for alle barna fra Folkeregisteret før søkeren kan gå videre', async () => {
        const { onCompleted, skjema } = renderSteg({ personalia: { ...personaliaUtenBarn, barn: [KIM, TRULTE] } });

        gåVidere();

        const kim = await screen.findByRole('radiogroup', { name: 'Bor Kim Gullaber i Norge?' });
        expect(await within(kim).findByText('Du må svare på om Kim Gullaber bor i Norge')).toBeInTheDocument();
        const trulte = screen.getByRole('radiogroup', { name: 'Bor Trulte Syltestrikk i Norge?' });
        expect(within(trulte).getByText('Du må svare på om Trulte Syltestrikk bor i Norge')).toBeInTheDocument();
        expect(screen.getByText('Du må fikse disse feilene før du kan fortsette:')).toBeInTheDocument();
        expect(onCompleted).not.toHaveBeenCalled();

        svar('Bor Kim Gullaber i Norge?', 'Ja');
        svar('Bor Trulte Syltestrikk i Norge?', 'Nei');
        svar('Bor Trulte Syltestrikk i et EØS-land?', 'Nei');
        gåVidere();

        await waitFor(() => expect(onCompleted).toHaveBeenCalledTimes(1));
        expect(skjema().getValues('svar.barnetillegg.bostedForBarnFraFolkeregisteret')).toEqual({
            kim: { borINorge: true, borIEøs: undefined },
            trulte: { borINorge: false, borIEøs: false },
        });
    });

    test('sier fra når det ikke finnes barn i Folkeregisteret og søkeren ikke har lagt til noen', async () => {
        hentBarnMock.mockResolvedValue([]);
        const { onCompleted } = renderSteg();

        expect(
            await screen.findByText('Vi fant ingen barn under 16 år som er registrert på deg i Folkeregisteret.'),
        ).toBeInTheDocument();
        gåVidere();

        const feil = await screen.findByText(INGEN_BARN_FEIL);
        expect(onCompleted).not.toHaveBeenCalled();
        expect(feil.closest('[tabindex="-1"]')).toHaveFocus();
    });

    test('går videre med bare manuelt registrerte barn når Folkeregisteret ikke har noen', async () => {
        const { onCompleted } = renderSteg({
            personalia: { ...personaliaUtenBarn, barn: [] },
            manueltRegistrerteBarn: [
                {
                    uuid: 'ola',
                    fnr: null,
                    fornavn: 'Ola',
                    etternavn: 'Nordmann',
                    fødselsdato: '2020-01-01',
                    borINorge: false,
                    borIEøs: true,
                },
            ],
        });

        expect(screen.getByText('Barn lagt til av deg')).toBeInTheDocument();
        gåVidere();

        await waitFor(() => expect(onCompleted).toHaveBeenCalledTimes(1));
        expect(screen.queryByText(INGEN_BARN_FEIL)).not.toBeInTheDocument();
    });

    test('fjerner feilen om manglende barn når søkeren legger til et barn i modalen', async () => {
        const { onCompleted, skjema } = renderSteg({ personalia: { ...personaliaUtenBarn, barn: [] } });
        gåVidere();
        expect(await screen.findByText(INGEN_BARN_FEIL)).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Legg til barn' }));
        const modal = screen.getByRole('dialog', { name: 'Andre barn' });
        fireEvent.change(within(modal).getByLabelText('Fornavn og mellomnavn'), { target: { value: 'Ola' } });
        fireEvent.change(within(modal).getByLabelText('Etternavn'), { target: { value: 'Nordmann' } });
        const fødselsdato = within(modal).getByLabelText('Fødselsdato');
        fireEvent.change(fødselsdato, { target: { value: '01.01.2020' } });
        fireEvent.blur(fødselsdato);

        expect(within(modal).getByRole('radiogroup', { name: 'Bor Ola Nordmann i Norge?' })).toBeInTheDocument();
        svar('Bor Ola Nordmann i Norge?', 'Nei', modal);
        svar('Bor Ola Nordmann i et EØS-land?', 'Ja', modal);
        fireEvent.click(within(modal).getByRole('button', { name: 'Lagre' }));

        expect(await screen.findByText('Barn lagt til av deg')).toBeInTheDocument();
        expect(screen.queryByText(INGEN_BARN_FEIL)).not.toBeInTheDocument();
        expect(skjema().getValues('svar.barnetillegg.manueltRegistrerteBarnSøktBarnetilleggFor')).toEqual([
            expect.objectContaining({ fornavn: 'Ola', etternavn: 'Nordmann', borINorge: false, borIEøs: true }),
        ]);

        gåVidere();
        await waitFor(() => expect(onCompleted).toHaveBeenCalledTimes(1));
    });

    test('modalen krever svar på bosted før barnet kan lagres', async () => {
        const { skjema } = renderSteg({ personalia: { ...personaliaUtenBarn, barn: [] } });

        fireEvent.click(screen.getByRole('button', { name: 'Legg til barn' }));
        const modal = screen.getByRole('dialog', { name: 'Andre barn' });
        fireEvent.change(within(modal).getByLabelText('Fornavn og mellomnavn'), { target: { value: 'Ola' } });
        fireEvent.change(within(modal).getByLabelText('Etternavn'), { target: { value: 'Nordmann' } });
        const fødselsdato = within(modal).getByLabelText('Fødselsdato');
        fireEvent.change(fødselsdato, { target: { value: '01.01.2020' } });
        fireEvent.blur(fødselsdato);
        svar('Bor Ola Nordmann i Norge?', 'Nei', modal);
        fireEvent.click(within(modal).getByRole('button', { name: 'Lagre' }));

        expect(await within(modal).findByText('Du må svare på om Ola Nordmann bor i et EØS-land')).toBeInTheDocument();
        expect(skjema().getValues('svar.barnetillegg.manueltRegistrerteBarnSøktBarnetilleggFor')).toEqual([]);
    });
});
