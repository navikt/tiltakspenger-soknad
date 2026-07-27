/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/jest-globals';
import { describe, expect, test } from '@jest/globals';
import { fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import FileUploader from './FileUploader';
import Søknad, { Vedlegg } from '@/types/Søknad';
import { MAKS_ANTALL_VEDLEGG, MAKS_FILSTØRRELSE_BYTES, MAKS_TOTAL_FILSTØRRELSE_BYTES } from './vedleggGrenser';

const BARN = 'barn-1';
const ANNET_BARN = 'barn-2';

/**
 * Lager en fil med oppgitt størrelse uten å faktisk allokere bytene.
 * Både Aksel og komponenten leser kun `size`, og et vedlegg på 11 MB i minnet per test er unødvendig.
 */
function fil(navn: string, størrelse: number, type = 'application/pdf'): File {
    const file = new File(['x'], navn, { type });
    Object.defineProperty(file, 'size', { value: størrelse });
    return file;
}

function filliste(filer: File[]): FileList {
    return Object.assign([...filer], { item: (i: number) => filer[i] ?? null }) as unknown as FileList;
}

/**
 * Rendrer uploaderen for ett barn, og skriver ut hele vedleggsfeltet ved siden av.
 * Vedleggsfeltet er felles for søknaden, så testene må kunne se vedlegg som hører til andre barn enn det som vises.
 */
function Harness({ startVedlegg, uuid }: { startVedlegg: Vedlegg[]; uuid: string }) {
    const form = useForm<Søknad>({ defaultValues: { vedlegg: startVedlegg } as Søknad });
    // `watch` og ikke en egen `useFieldArray`: to instanser på samme navn holder ikke sin lokale
    // `fields`-state i synk, så harnessen ville ikke sett det komponenten legger til.
    const vedlegg = form.watch('vedlegg') ?? [];
    return (
        <>
            <FileUploader
                name="vedlegg"
                control={form.control}
                label="Last opp fødselsattest eller adopsjonsbevis"
                uuid={uuid}
            />
            <ol data-testid="alle-vedlegg">
                {vedlegg.map((v) => (
                    <li key={`${v.uuid}/${v.file.name}`}>{`${v.uuid}/${v.file.name}`}</li>
                ))}
            </ol>
        </>
    );
}

function renderUploader(startVedlegg: Vedlegg[] = [], uuid = BARN) {
    const { container } = render(<Harness startVedlegg={startVedlegg} uuid={uuid} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    return {
        input,
        velg: (...filer: File[]) => fireEvent.change(input, { target: { files: filliste(filer) } }),
        alleVedlegg: () =>
            within(screen.getByTestId('alle-vedlegg'))
                .queryAllByRole('listitem')
                .map((el) => el.textContent),
    };
}

describe('FileUploader', () => {
    test('sier fra om begge størrelsesgrensene før brukeren har valgt noe', () => {
        renderUploader();

        expect(
            screen.getByText(
                'Vedlegget kan være PDF, JPG eller PNG, og maks 10 MB. Til sammen kan vedleggene være maks 50 MB.',
            ),
        ).toBeInTheDocument();
    });

    test('godtar en fil som er nøyaktig på grensen', () => {
        const { velg, alleVedlegg } = renderUploader();

        velg(fil('cv.pdf', MAKS_FILSTØRRELSE_BYTES));

        expect(alleVedlegg()).toEqual([`${BARN}/cv.pdf`]);
    });

    test('avviser en fil over 10 MB og legger den ikke til', () => {
        const { velg, alleVedlegg } = renderUploader();

        velg(fil('for-stor.pdf', MAKS_FILSTØRRELSE_BYTES + 1));

        expect(screen.getByText('«for-stor.pdf» er større enn 10 MB og ble ikke lagt til.')).toBeInTheDocument();
        expect(alleVedlegg()).toEqual([]);
    });

    test('tar imot de gyldige filene selv om én i samme utvalg er for stor', () => {
        const { velg, alleVedlegg } = renderUploader();

        velg(fil('ok.pdf', 1000), fil('for-stor.pdf', MAKS_FILSTØRRELSE_BYTES + 1));

        expect(alleVedlegg()).toEqual([`${BARN}/ok.pdf`]);
        expect(screen.getByText(/«for-stor.pdf» er større enn 10 MB/)).toBeInTheDocument();
    });

    test('stenger opplasting når grensen er nådd, og teller da vedlegg for alle barna', () => {
        // Backend teller vedlegg per søknad, ikke per barn, så uploaderen må gjøre det samme
        // selv om den bare viser vedleggene til sitt eget barn.
        const alleredeLastetOpp = Array.from({ length: MAKS_ANTALL_VEDLEGG }, (_, i) => ({
            file: fil(`gammel-${i}.pdf`, 1000),
            uuid: ANNET_BARN,
        }));
        const { input } = renderUploader(alleredeLastetOpp);

        // Aksel deaktiverer dropsonen via `fileLimit`, så brukeren kommer ikke til å velge en fil i det hele tatt.
        expect(input).toBeDisabled();
        expect(
            screen.getByText('Du kan ikke laste opp flere vedlegg. Søknaden kan ha maks 10 vedlegg.'),
        ).toBeInTheDocument();
    });

    test('fyller opp til grensen og avviser bare overskuddet', () => {
        const alleredeLastetOpp = Array.from({ length: MAKS_ANTALL_VEDLEGG - 1 }, (_, i) => ({
            file: fil(`gammel-${i}.pdf`, 1000),
            uuid: ANNET_BARN,
        }));
        const { velg, alleVedlegg } = renderUploader(alleredeLastetOpp);

        velg(fil('får-plass.pdf', 1000), fil('får-ikke-plass.pdf', 1000));

        expect(alleVedlegg()).toHaveLength(MAKS_ANTALL_VEDLEGG);
        expect(alleVedlegg()).toContain(`${BARN}/får-plass.pdf`);
        expect(screen.getByText(/Ett vedlegg ble ikke lagt til/)).toBeInTheDocument();
    });

    test('stopper vedlegg som sprenger totalgrensen, selv om hver enkelt er innenfor', () => {
        // Hver fil her er lovlig i seg selv, og antallet er langt under grensen — dette er tilfellet
        // hverken `maxSizeInBytes` eller `fileLimit` kan fange for oss.
        const fireFulleFiler = Array.from({ length: 4 }, (_, i) => ({
            file: fil(`gammel-${i}.pdf`, MAKS_FILSTØRRELSE_BYTES),
            uuid: ANNET_BARN,
        }));
        const { velg, alleVedlegg } = renderUploader(fireFulleFiler);

        // 40 MB ligger allerede inne. Den lille får plass, den fulle ville tatt totalen til 51 MB.
        velg(fil('liten.pdf', 1_000_000), fil('for-mye-til-sammen.pdf', MAKS_FILSTØRRELSE_BYTES));

        expect(alleVedlegg()).toContain(`${BARN}/liten.pdf`);
        expect(alleVedlegg()).not.toContain(`${BARN}/for-mye-til-sammen.pdf`);
        expect(
            screen.getByText('Ett vedlegg ble ikke lagt til. Vedleggene kan til sammen være maks 50 MB.'),
        ).toBeInTheDocument();
    });

    test('godtar vedlegg som treffer totalgrensen nøyaktig', () => {
        const fireFulleFiler = Array.from({ length: 4 }, (_, i) => ({
            file: fil(`gammel-${i}.pdf`, MAKS_FILSTØRRELSE_BYTES),
            uuid: ANNET_BARN,
        }));
        const { velg, alleVedlegg } = renderUploader(fireFulleFiler);

        // 40 MB + 10 MB = nøyaktig 50 MB.
        velg(fil('siste.pdf', MAKS_TOTAL_FILSTØRRELSE_BYTES - 4 * MAKS_FILSTØRRELSE_BYTES));

        expect(alleVedlegg()).toContain(`${BARN}/siste.pdf`);
    });

    test('viser identisk feilmelding bare én gang', () => {
        // To filer kan hete det samme når de dras inn fra ulike mapper. Da blir meldingene identiske,
        // og uten deduplisering får vi både en dobbel melding til brukeren og dupliserte React-keys.
        const { velg } = renderUploader();

        velg(fil('cv.pdf', MAKS_FILSTØRRELSE_BYTES + 1), fil('cv.pdf', MAKS_FILSTØRRELSE_BYTES + 2));

        expect(screen.getAllByText('«cv.pdf» er større enn 10 MB og ble ikke lagt til.')).toHaveLength(1);
    });

    test('viser kun vedleggene til sitt eget barn', () => {
        renderUploader([
            { file: fil('mitt.pdf', 1000), uuid: BARN },
            { file: fil('annet-barn.pdf', 1000), uuid: ANNET_BARN },
        ]);

        expect(screen.getByText('mitt.pdf')).toBeInTheDocument();
        expect(screen.queryByText('annet-barn.pdf')).not.toBeInTheDocument();
    });

    test('sletter riktig fil når et annet barn har vedlegg foran i lista', () => {
        // Visningen er filtrert på barnets uuid, mens `remove` tar indeksen i det fulle feltarrayet.
        // Brukes visningsindeksen, sletter man vedlegget til et annet barn.
        const { alleVedlegg } = renderUploader([
            { file: fil('annet-barn.pdf', 1000), uuid: ANNET_BARN },
            { file: fil('mitt.pdf', 1000), uuid: BARN },
        ]);

        fireEvent.click(screen.getByRole('button', { name: /slett/i }));

        expect(alleVedlegg()).toEqual([`${ANNET_BARN}/annet-barn.pdf`]);
    });

    test('feilmeldingen forsvinner når brukeren velger en gyldig fil etterpå', () => {
        const { velg } = renderUploader();

        velg(fil('for-stor.pdf', MAKS_FILSTØRRELSE_BYTES + 1));
        expect(screen.getByText(/er større enn 10 MB/)).toBeInTheDocument();

        velg(fil('ok.pdf', 1000));
        expect(screen.queryByText(/er større enn 10 MB/)).not.toBeInTheDocument();
    });
});
