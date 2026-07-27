import { DateValidationT } from '@navikt/ds-react';
import { formatDate } from '@/utils/formatDate';

export const DATOFORMAT = 'dd.mm.åååå';
export const DATOFORMAT_BESKRIVELSE = `Format: ${DATOFORMAT}`;

export interface Datogrenser {
    /** Hva feltet heter i feilmeldingene, f.eks. «Fødselsdato» eller «Fra-dato». */
    feltnavn: string;
    fraDato?: Date;
    tilDato?: Date;
    datoMåVæreIFortid?: boolean;
}

/**
 * Oversetter valideringsobjektet fra `useDatepicker` til en feilmelding.
 *
 * Aksel parser dd.mm.åååå, ddmmåååå, dd/mm/åååå og dd-mm-åååå (og tosifret år) rett ut av boksen,
 * så brukeren kan skrive datoen på flere måter uten at vi legger noe eget oppå.
 * Tomt felt gir ingen melding herfra — det håndteres av påkrevd-validatorene i skjemaet.
 */
export function datoFeilmelding(
    validering: DateValidationT | null,
    { feltnavn, fraDato, tilDato, datoMåVæreIFortid }: Datogrenser,
): string | undefined {
    if (!validering || validering.isValidDate || validering.isEmpty) {
        return undefined;
    }
    if (validering.isAfter) {
        if (datoMåVæreIFortid) {
            return `${feltnavn} kan ikke være fram i tid`;
        }
        return tilDato
            ? `${feltnavn} kan ikke være etter ${formatDate(tilDato)}`
            : `${feltnavn} er utenfor gyldig periode`;
    }
    if (validering.isBefore) {
        return fraDato
            ? `${feltnavn} kan ikke være før ${formatDate(fraDato)}`
            : `${feltnavn} er utenfor gyldig periode`;
    }
    if (validering.isWeekend) {
        return `${feltnavn} kan ikke være en lørdag eller søndag`;
    }
    if (validering.isDisabled) {
        return `${feltnavn} kan ikke velges`;
    }
    // Aksel garanterer at minst ett flagg er satt når isValidDate er false, så det som står
    // igjen her er isInvalid: datoen lar seg ikke tolke.
    return `${feltnavn} er ugyldig. Bruk formatet ${DATOFORMAT}`;
}
