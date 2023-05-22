import Spørsmålsbesvarelser from '@/types/Spørsmålsbesvarelser';
import { Søknadssteg } from '@/types/Søknadssteg';

export function brukerHarFyltUtTiltakssteg({
    tiltak: {
        aktivitetId,
        periode,
        søkerHeleTiltaksperioden,
        arenaRegistrertPeriode,
    },
}: Spørsmålsbesvarelser) {
    const tiltaketHarPeriode =
        arenaRegistrertPeriode &&
        arenaRegistrertPeriode.fra &&
        arenaRegistrertPeriode.til;
    if (tiltaketHarPeriode && søkerHeleTiltaksperioden === undefined) {
        return false;
    } else if (søkerHeleTiltaksperioden) {
        return !!aktivitetId;
    } else {
        return !!aktivitetId && !!periode;
    }
}

export function brukerHarFyltUtKvpSteg({
    kvalifiseringsprogram,
    introduksjonsprogram,
    institusjonsopphold,
}: Spørsmålsbesvarelser) {
    if (
        kvalifiseringsprogram.deltar === undefined ||
        introduksjonsprogram.deltar === undefined ||
        institusjonsopphold.borPåInstitusjon === undefined
    ) {
        return false;
    }

    if (kvalifiseringsprogram.deltar) {
        if (!kvalifiseringsprogram.periode) {
            return false;
        }
    }

    if (introduksjonsprogram.deltar) {
        if (!introduksjonsprogram.periode) {
            return false;
        }
    }

    if (institusjonsopphold.borPåInstitusjon) {
        if (!institusjonsopphold.periode) {
            return false;
        }
    }
    return true;
}

export function brukerHarFyltUtAndreUtbetalingerSteg({
    pensjonsordning,
    etterlønn,
}: Spørsmålsbesvarelser) {
    if (
        pensjonsordning.mottarEllerSøktPensjonsordning === undefined ||
        etterlønn.mottarEllerSøktEtterlønn === undefined
    ) {
        return false;
    }

    if (pensjonsordning.mottarEllerSøktPensjonsordning) {
        if (!pensjonsordning.periode) {
            return false;
        }
    }

    if (etterlønn.mottarEllerSøktEtterlønn) {
        if (!etterlønn.periode) {
            return false;
        }
    }

    return true;
}

export function brukerHarFyltUtNødvendigeOpplysninger(
    svar: Spørsmålsbesvarelser,
    steg: Søknadssteg
) {
    if (steg === Søknadssteg.TILTAK) {
        // todo: Sjekk at bruker har huket av på bekreftelsesboks på innledningssteget når det er klart
        return true;
    } else if (steg === Søknadssteg.KVP) {
        return brukerHarFyltUtTiltakssteg(svar);
    } else if (steg === Søknadssteg.ANDRE_UTBETALINGER) {
        return brukerHarFyltUtTiltakssteg(svar) && brukerHarFyltUtKvpSteg(svar);
    } else if (steg === Søknadssteg.BARNETILLEGG) {
        return (
            brukerHarFyltUtTiltakssteg(svar) &&
            brukerHarFyltUtKvpSteg(svar) &&
            brukerHarFyltUtAndreUtbetalingerSteg(svar)
        );
    } else if (steg === Søknadssteg.OPPSUMMERING) {
        // todo: Sjekk at bruker har fylt ut steget om barnetillegg når det er klart
        return (
            brukerHarFyltUtTiltakssteg(svar) &&
            brukerHarFyltUtKvpSteg(svar) &&
            brukerHarFyltUtAndreUtbetalingerSteg(svar)
        );
    }
}
