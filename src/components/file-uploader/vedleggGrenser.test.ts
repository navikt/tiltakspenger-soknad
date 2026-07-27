import { describe, expect, test } from '@jest/globals';
import {
    feilmeldingForAntall,
    feilmeldingForAvvistFil,
    feilmeldingForTotalStørrelse,
    MAKS_ANTALL_VEDLEGG,
    MAKS_FILSTØRRELSE_BYTES,
    MAKS_TOTAL_FILSTØRRELSE_BYTES,
    maksFilstørrelseTekst,
} from './vedleggGrenser';

describe('vedleggGrenser', () => {
    test('grensene er de samme som backend håndhever i VedleggValidering.kt', () => {
        // Endres et av disse tallene uten at backend endres tilsvarende, slipper søknadsdialogen gjennom vedlegg
        // som gir 400 ved innsending — eller stopper vedlegg backend ville godtatt.
        expect(MAKS_FILSTØRRELSE_BYTES).toBe(10_000_000);
        expect(MAKS_ANTALL_VEDLEGG).toBe(10);
        expect(MAKS_TOTAL_FILSTØRRELSE_BYTES).toBe(50_000_000);
    });

    test('størrelsesgrensen vises som hele MB til brukeren', () => {
        expect(maksFilstørrelseTekst).toBe('10 MB');
    });

    test('for stor fil får en melding som sier hvor grensen går', () => {
        expect(feilmeldingForAvvistFil('cv.pdf', ['fileSize'])).toBe(
            '«cv.pdf» er større enn 10 MB og ble ikke lagt til.',
        );
    });

    test('feil filtype får en melding som sier hvilke typer som godtas', () => {
        expect(feilmeldingForAvvistFil('notater.docx', ['fileType'])).toBe(
            '«notater.docx» ble ikke lagt til. Vedlegg må være PDF, JPG eller PNG.',
        );
    });

    test('størrelse nevnes først når filen bryter mot både størrelse og type', () => {
        expect(feilmeldingForAvvistFil('stor.docx', ['fileType', 'fileSize'])).toContain('større enn 10 MB');
    });

    test('ukjent avvisningsgrunn gir fortsatt en melding som navngir filen', () => {
        expect(feilmeldingForAvvistFil('cv.pdf', ['noeHeltAnnet'])).toBe('«cv.pdf» ble ikke lagt til.');
    });

    test('antallsmeldingen bøyes riktig for ett og flere vedlegg', () => {
        expect(feilmeldingForAntall(1)).toBe('Ett vedlegg ble ikke lagt til. Søknaden kan ha maks 10 vedlegg.');
        expect(feilmeldingForAntall(3)).toBe('3 vedlegg ble ikke lagt til. Søknaden kan ha maks 10 vedlegg.');
    });

    test('totalmeldingen sier «til sammen», så den ikke forveksles med per fil-grensen', () => {
        // Uten «til sammen» ser det ut som om det er den enkelte filen som er for stor, og brukeren
        // sitter igjen med en fil på 2 MB som ble avvist av en grense på 10 MB.
        expect(feilmeldingForTotalStørrelse(1)).toBe(
            'Ett vedlegg ble ikke lagt til. Vedleggene kan til sammen være maks 50 MB.',
        );
        expect(feilmeldingForTotalStørrelse(2)).toBe(
            '2 vedlegg ble ikke lagt til. Vedleggene kan til sammen være maks 50 MB.',
        );
    });
});
