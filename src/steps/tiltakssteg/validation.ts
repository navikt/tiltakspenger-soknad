import {
    påkrevdPeriodeValidator,
    påkrevdSvarValidator,
} from '@/utils/formValidators';
import { FormPeriode } from '@/types/FormPeriode';

export function påkrevdTiltaksperiodeSpørsmål(verdi: FormPeriode) {
    return påkrevdPeriodeValidator(verdi, 'Du må oppgi hvilken periode du søker tiltakspenger for');
}

export function valgtTiltakValidator(verdi: string) {
    return påkrevdSvarValidator(verdi, 'Du må oppgi hvilket tiltak du søker tiltakspenger for');
}
