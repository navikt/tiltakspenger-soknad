import {
    periodeInngårIAnnenPeriodeValidator,
    påkrevdJaNeiSpørsmålValidator,
    påkrevdPeriodeValidator,
} from '@/utils/formValidators';
import { FormPeriode } from '@/types/FormPeriode';
import { Periode } from '@/types/Periode';
import { formatPeriode } from '@/utils/formatPeriode';

export function deltarIKvpValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du deltar i kvalifiseringsprogrammet');
}

export function deltarIIntroprogrammetValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du deltar i introduksjonsprogrammet');
}

export function borPåInstitusjonValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du bor på institusjon');
}

export function påkrevdKvpPeriodeValidator(periode: FormPeriode) {
    return påkrevdPeriodeValidator(periode, 'Du må oppgi hvilken periode du deltar i kvalifiseringsprogrammet');
}

export function påkrevdIntroprogramPeriodeValidator(periode: FormPeriode) {
    return påkrevdPeriodeValidator(periode, 'Du må oppgi hvilken periode du deltar i introduksjonsprogrammet');
}

export function påkrevdInstitusjonsoppholdPeriodeValidator(periode: FormPeriode) {
    return påkrevdPeriodeValidator(periode, 'Du må oppgi hvilken periode du bor på institusjon');
}

export function periodenErInnenforTiltaksperiodeValidator(periode: FormPeriode, tiltaksperiode: Periode | FormPeriode) {
    return periodeInngårIAnnenPeriodeValidator(
        periode,
        tiltaksperiode!,
        `Perioden kan ikke gå utenfor perioden på det registrerte tiltaket (${formatPeriode(tiltaksperiode!)})`
    );
}
