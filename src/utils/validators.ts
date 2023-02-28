export function påkrevdJaNeiSpørsmålValidator(verdi: boolean, feilmelding: string) {
    if (verdi !== false && verdi !== true) {
        return feilmelding;
    }
}
