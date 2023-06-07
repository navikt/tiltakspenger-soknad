import { FormPeriode } from '@/types/FormPeriode';
import { påkrevdJaNeiSpørsmålValidator, påkrevdPeriodeValidator } from '@/utils/formValidators';

export function påkrevdInstitusjonsoppholdPeriodeValidator(periode: FormPeriode) {
    return påkrevdPeriodeValidator(periode, 'Du må oppgi hvilken periode du bor på institusjon');
}

export function borPåInstitusjonValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du bor på institusjon');
}
