/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/jest-globals';
import { beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';

// uuid er ren ESM og lar seg ikke laste av jest uten transformering. Demoens mocker bruker den.
jest.mock('uuid', () => ({ v4: () => 'uuid' }));

let Demovalg: typeof import('./Demovalg').default;

beforeAll(async () => {
    Demovalg = (await import('./Demovalg')).default;
});

// Navnet på gruppen inkluderer også beskrivelsen, så vi matcher bare på starten.
const RESULTATSPØRSMÅL = /^Demo: Hva er resultatet av behandlingen\?/;

describe('Demovalg', () => {
    beforeEach(() => {
        document.cookie.split(';').forEach((cookie) => {
            document.cookie = `${cookie.split('=')[0].trim()}=; path=/; Max-Age=0`;
        });
    });

    test('spør om resultatet av behandlingen bare når brukeren har sendt inn en søknad tidligere', () => {
        render(<Demovalg medTidligereSøknad={false} resultat="UNDER_BEHANDLING" vedtak="INGEN" />);
        expect(screen.queryByRole('radiogroup', { name: RESULTATSPØRSMÅL })).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole('radio', { name: 'Ja' }));

        expect(screen.getByRole('radiogroup', { name: RESULTATSPØRSMÅL })).toBeInTheDocument();
        expect(screen.getByRole('radio', { name: 'Under behandling' })).toBeChecked();
        expect(document.cookie).toContain('demo-tidligere-soknad=true');
    });

    test('husker valgt resultat i en cookie og glemmer søknadene sendt inn i demoen', () => {
        document.cookie = 'demo-sesjon=en-sesjon; path=/';
        render(<Demovalg medTidligereSøknad resultat="UNDER_BEHANDLING" vedtak="INGEN" />);

        fireEvent.click(screen.getByRole('radio', { name: 'Avbrutt' }));

        expect(screen.getByRole('radio', { name: 'Avbrutt' })).toBeChecked();
        expect(document.cookie).toContain('demo-tidligere-soknad-resultat=AVBRUTT');
        expect(document.cookie).not.toContain('demo-sesjon');
    });

    test('spør om vedtak før en ny behandling bare når søknaden er under behandling eller avbrutt', () => {
        const vedtaksspørsmål = /^Demo: Fikk brukeren vedtak på en enda eldre søknad for tiltaket\?/;
        render(<Demovalg medTidligereSøknad resultat="INNVILGELSE" vedtak="INGEN" />);
        expect(screen.queryByRole('radiogroup', { name: vedtaksspørsmål })).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole('radio', { name: 'Avbrutt' }));
        fireEvent.click(
            within(screen.getByRole('radiogroup', { name: vedtaksspørsmål })).getByRole('radio', {
                name: 'Ja, avslått',
            }),
        );

        expect(screen.getByRole('radio', { name: 'Ja, avslått' })).toBeChecked();
        expect(document.cookie).toContain('demo-tidligere-vedtak=AVSLAG');
    });
});
