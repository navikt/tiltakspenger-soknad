/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/jest-globals';
import { describe, expect, test } from '@jest/globals';
import { render, screen, within } from '@testing-library/react';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Periodespørsmål from './Periodespørsmål';

const SPØRSMÅL = 'Når mottok du sykepenger?';

function Skjema({ children }: { children: React.ReactNode }) {
    const skjema = useForm();
    return <FormProvider {...skjema}>{children}</FormProvider>;
}

describe('Periodespørsmål', () => {
    test('spørsmålet er gruppenavnet til feltene, ikke en løs label ved siden av', () => {
        // Flere periodespørsmål på samme side gir ellers bare «Fra»/«Til» for skjermlesere.
        render(
            <Skjema>
                <Periodespørsmål name="svar.sykepenger.periode">{SPØRSMÅL}</Periodespørsmål>
            </Skjema>,
        );

        const gruppe = screen.getByRole('group', { name: SPØRSMÅL });
        expect(within(gruppe).getByLabelText('Fra')).toBeInTheDocument();
        expect(within(gruppe).getByLabelText('Til')).toBeInTheDocument();
    });

    test('gruppen beholder feltnavnet som id, så ErrorSummary kan hoppe hit', () => {
        render(
            <Skjema>
                <Periodespørsmål name="svar.sykepenger.periode">{SPØRSMÅL}</Periodespørsmål>
            </Skjema>,
        );

        expect(screen.getByRole('group', { name: SPØRSMÅL })).toHaveAttribute('id', 'svar.sykepenger.periode');
    });
});
