import { FormPeriode } from '@/types/FormPeriode';
import dayjs from 'dayjs';

export function påkrevdJaNeiSpørsmålValidator(
    verdi: boolean,
    feilmelding: string
) {
    if (verdi !== false && verdi !== true) {
        return feilmelding;
    }
}

export function påkrevdBekreftelsesspørsmål(
    verdi: boolean,
    feilmelding: string
) {
    if (verdi !== true) {
        return feilmelding;
    }
}

export function gyldigPeriodeValidator(periode: FormPeriode) {
    const fraDato = dayjs(periode?.fra);
    const tilDato = dayjs(periode?.til);

    if (fraDato.isAfter(tilDato)) {
        return 'Fra-dato kan ikke være etter til-dato';
    }
}

export function påkrevdPeriodeValidator(
    periode: FormPeriode,
    feilmelding: string
) {
    if (!periode?.fra || !periode?.til) {
        return feilmelding;
    }
}

export function påkrevdDatoValidator(dato: Date, feilmelding: string) {
    if (!dato) {
        return feilmelding;
    }
}

export function påkrevdFritekstfeltValidator(
    verdi: string,
    feilmelding: string
) {
    if (!verdi || verdi.length === 0) {
        return feilmelding;
    }
}

export function påkrevdSvarValidator(verdi: string, feilmelding: string) {
    if (!verdi) {
        return feilmelding;
    }
}
