import { påkrevdJaNeiSpørsmålValidator, påkrevdPeriodeValidator } from '@/utils/formValidators';
import { FormPeriode } from '@/types/FormPeriode';

export function påkrevdSøkerHeleTiltaksperiodenValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du søker tiltakspenger for hele tiltaksperioden');
}

export function påkrevdTiltaksperiodeSpørsmål(verdi: FormPeriode) {
    return påkrevdPeriodeValidator(verdi, 'Du må oppgi hvilken periode du søker tiltakspenger for');
}
