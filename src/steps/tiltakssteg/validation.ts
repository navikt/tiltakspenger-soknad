import {
    periodeInngårIAnnenPeriodeValidator,
    påkrevdJaNeiSpørsmålValidator,
    påkrevdPeriodeValidator,
    påkrevdSvarValidator,
} from '@/utils/formValidators';
import { FormPeriode } from '@/types/FormPeriode';
import { Periode } from '@/types/Periode';
import { formatPeriode } from '@/utils/formatPeriode';

export function påkrevdSøkerHeleTiltaksperiodenValidator(verdi: boolean) {
    return påkrevdJaNeiSpørsmålValidator(verdi, 'Du må svare på om du søker tiltakspenger for hele tiltaksperioden');
}

export function påkrevdTiltaksperiodeSpørsmål(verdi: FormPeriode) {
    return påkrevdPeriodeValidator(verdi, 'Du må oppgi hvilken periode du søker tiltakspenger for');
}

export function valgtTiltakValidator(verdi: string) {
    return påkrevdSvarValidator(verdi, 'Du må oppgi hvilket tiltak du søker tiltakspenger for');
}

export function innenforArenaRegistrertPeriodeValidator(periode: FormPeriode, arenaRegistrertPeriode: Periode) {
    return periodeInngårIAnnenPeriodeValidator(
        periode,
        arenaRegistrertPeriode!,
        `Perioden kan ikke gå utenfor perioden på det registrerte tiltaket (${formatPeriode(arenaRegistrertPeriode!)})`
    );
}
