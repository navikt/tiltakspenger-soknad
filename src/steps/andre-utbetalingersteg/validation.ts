import { påkrevdDatoValidator, påkrevdJaNeiSpørsmålValidator, påkrevdPeriodeValidator } from '@/utils/formValidators';
import { FormPeriode } from '@/types/FormPeriode';
import Spørsmålsbesvarelser from "@/types/Spørsmålsbesvarelser";

export function sykepengerValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du har søkt eller mottar sykepenger');
}

export function gjenlevendepensjonValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du har søkt eller mottar gjenlevendepensjon');
}

export function alderspensjonValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du har søkt eller mottar alderspensjon');
}

export function pensjonsordningValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du har søkt eller mottar pensjonsordning');
}

export function jobbsjansenValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du har søkt eller mottar stønad gjennom Jobbsjansen');
}

export function etterlønnValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du har søkt eller mottar etterlønn');
}

export function lønnetArbeidValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du er i lønnet arbeid');
}

export function supplerendeStønadOver67Validator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(
        verdi,
        'Du må svare på om du har søkt eller mottar supplerende stønad for personer over 67 år'
    );
}

export function supplerendeStønadFlyktningerValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(
        verdi,
        'Du må svare på om du har søkt eller mottar supplerende stønad for uføre flyktninger'
    );
}

export function påkrevdSykepengerPeriodeValidator(periode: FormPeriode) {
    return påkrevdPeriodeValidator(periode, 'Du må oppgi hvilken periode du mottar sykepenger');
}

export function påkrevdGjenlevendepensjonPeriodeValidator(periode: FormPeriode) {
    return påkrevdPeriodeValidator(periode, 'Du må oppgi hvilken periode du mottar gjenlevendepensjon');
}

export function påkrevdJobbsjansenPeriodeValidator(periode: FormPeriode) {
    return påkrevdPeriodeValidator(periode, 'Du må oppgi hvilken periode du mottar Jobbsjansen');
}

export function påkrevdPensjonsordningPeriodeValidator(periode: FormPeriode) {
    return påkrevdPeriodeValidator(periode, 'Du må oppgi hvilken periode du mottar pengestøtte fra andre ordninger');
}

export function påkrevdSupplerendeStønadOver67PeriodeValidator(periode: FormPeriode) {
    return påkrevdPeriodeValidator(
        periode,
        'Du må oppgi hvilken periode du mottar supplerende stønad for personer over 67 år'
    );
}

export function påkrevdSupplerendeStønadFlyktningerPeriodeValidator(periode: FormPeriode) {
    return påkrevdPeriodeValidator(
        periode,
        'Du må oppgi hvilken periode du mottar supplerende stønad for uføre flyktninger'
    );
}

export function påkrevdAlderspensjonDatofeltValidator(verdi: Date) {
    return påkrevdDatoValidator(verdi, 'Du må oppgi fra dato til alderspensjonen');
}

export function mottarAndreUtbetalingerValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du mottar andre utbetalinger');
}

export function minstEnAnnenUtbetalingHvisJaValidator({ alderspensjon, gjenlevendepensjon, pensjonsordning, supplerendestønadover67, supplerendestønadflyktninger, jobbsjansen}: Spørsmålsbesvarelser, mottarAndreUtbetalinger: boolean) {
    if (mottarAndreUtbetalinger && !((gjenlevendepensjon && gjenlevendepensjon.mottar) ||
        (alderspensjon && alderspensjon.mottar) || (jobbsjansen && jobbsjansen.mottar) ||
        (supplerendestønadover67 && supplerendestønadover67.mottar) || (supplerendestønadflyktninger && supplerendestønadflyktninger.mottar) ||
        (pensjonsordning && pensjonsordning.mottar))
    ) {
        return "Du må svare ja på at du mottar minst én annen utbetaling"
    }
}
