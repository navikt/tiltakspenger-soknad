import { DateValidationT } from '@navikt/ds-react';
import { useState } from 'react';
import { Datogrenser, datoFeilmelding } from '@/components/datovelger/datoFeilmelding';

export interface Datofeil {
    /** Send til `useDatepicker` sin `onValidate`. */
    onValidate: (validering: DateValidationT) => void;
    /** Send til `DatePicker.Input` sin `onBlur`. */
    markerSomBerørt: () => void;
    /** Feilmeldingen som skal vises nå, eller `undefined` hvis den ikke skal vises ennå. */
    feilmelding?: string;
}

/**
 * Holder styr på når en datofeil skal vises for brukeren.
 *
 * Vi venter til feltet har vært forlatt én gang, ellers står det «er ugyldig» mens datoen
 * fortsatt er halvskrevet.
 * Har skjemaet allerede meldt fra om feil på feltet — altså etter innsending — viser vi med
 * en gang.
 * Uten det siste ville brukeren som skriver en ugyldig dato og trykker enter få «du må oppgi
 * dato» mens det står tekst i feltet, siden enter sender inn uten å utløse blur.
 */
export function useDatofeil(grenser: Datogrenser, harSkjemafeil: boolean): Datofeil {
    const [validering, setValidering] = useState<DateValidationT | null>(null);
    const [erBerørt, setErBerørt] = useState(false);

    return {
        onValidate: setValidering,
        markerSomBerørt: () => setErBerørt(true),
        feilmelding: erBerørt || harSkjemafeil ? datoFeilmelding(validering, grenser) : undefined,
    };
}
