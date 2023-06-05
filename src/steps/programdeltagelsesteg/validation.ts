import { påkrevdJaNeiSpørsmålValidator, påkrevdPeriodeValidator } from '@/utils/formValidators';
import { FormPeriode } from '@/types/FormPeriode';

export function deltarIKvpValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du deltar i kvalifiseringsprogrammet');
}

export function deltarIIntroprogrammetValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du deltar i introduksjonsprogrammet');
}

export function påkrevdKvpPeriodeValidator(periode: FormPeriode) {
    return påkrevdPeriodeValidator(periode, 'Du må oppgi hvilken periode du deltar i kvalifiseringsprogrammet');
}

export function påkrevdIntroprogramPeriodeValidator(periode: FormPeriode) {
    return påkrevdPeriodeValidator(periode, 'Du må oppgi hvilken periode du deltar i introduksjonsprogrammet');
}
