import Spørsmålsbesvarelser from '@/types/Spørsmålsbesvarelser';
import { Søknadssteg } from '@/types/Søknadssteg';

export function brukerHarFyltUtTiltakssteg({
    tiltak: { aktivitetId, periode, søkerHeleTiltaksperioden, arenaRegistrertPeriode },
}: Spørsmålsbesvarelser) {
    const tiltaketHarPeriode = arenaRegistrertPeriode && arenaRegistrertPeriode.fra && arenaRegistrertPeriode.til;
    if (tiltaketHarPeriode && søkerHeleTiltaksperioden === undefined) {
        return false;
    } else if (søkerHeleTiltaksperioden) {
        return !!aktivitetId;
    } else {
        return !!aktivitetId && !!periode;
    }
}

export function brukerHarFyltUtProgramDeltagelseSteg({
    kvalifiseringsprogram,
    introduksjonsprogram,
}: Spørsmålsbesvarelser) {
    if (
        kvalifiseringsprogram.deltar === undefined ||
        introduksjonsprogram.deltar === undefined
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

    return true;
}

export function brukerHarFyltUtInstitusjonsoppholdSteg({ institusjonsopphold }: Spørsmålsbesvarelser) {
    if (institusjonsopphold.borPåInstitusjon === undefined) {
        return false;
    }

    if (institusjonsopphold.borPåInstitusjon) {
        if (!institusjonsopphold.periode) {
            return false;
        }
    }
    return true;
}

export function brukerHarFyltUtAndreUtbetalingerSteg(spørsmålsbesvarelser: Spørsmålsbesvarelser) {
    const { mottarAndreUtbetalinger, sykepenger, alderspensjon,
            gjenlevendepensjon, pensjonsordning, etterlønn,
            supplerendestønadover67, supplerendestønadflyktninger,
            jobbsjansen} = spørsmålsbesvarelser;

    if (mottarAndreUtbetalinger === undefined) {
        return false;
    }

    if (sykepenger && sykepenger.mottar) {
        if (!sykepenger.periode) {
            return false;
        }
    }

    if (gjenlevendepensjon && gjenlevendepensjon.mottar) {
        if (!gjenlevendepensjon.periode) {
            return false;
        }
    }

    if (alderspensjon && alderspensjon.mottar) {
        if (!alderspensjon.fraDato) {
            return false;
        }
    }

    if (pensjonsordning && pensjonsordning.mottar) {
        if (!gjenlevendepensjon.periode) {
            return false;
        }
    }

    if (jobbsjansen && jobbsjansen.mottar) {
        if (!gjenlevendepensjon.periode) {
            return false;
        }
    }

    if (supplerendestønadover67 && supplerendestønadover67.mottar) {
        if (!gjenlevendepensjon.periode) {
            return false;
        }
    }

    if (supplerendestønadflyktninger && supplerendestønadflyktninger.mottar) {
        if (!gjenlevendepensjon.periode) {
            return false;
        }
    }

    if (!((sykepenger && sykepenger.mottar) || (gjenlevendepensjon && gjenlevendepensjon.mottar) ||
        (alderspensjon && alderspensjon.mottar) || pensjonsordning && pensjonsordning.mottar ||
        (jobbsjansen && jobbsjansen.mottar) || (supplerendestønadover67 && supplerendestønadover67.mottar) ||
        (supplerendestønadflyktninger && supplerendestønadflyktninger.mottar))) {
        return false;
    }

    return true;
}

export function brukerHarFyltUtOppsummeringssteg({ harBekreftetAlleOpplysninger }: Spørsmålsbesvarelser) {
    return harBekreftetAlleOpplysninger;
}

export function brukerHarFyltUtNødvendigeOpplysninger(svar: Spørsmålsbesvarelser, steg: Søknadssteg) {
    if (steg === Søknadssteg.TILTAK) {
        // todo: Sjekk at bruker har huket av på bekreftelsesboks på innledningssteget når det er klart
        return true;
    } else if (steg === Søknadssteg.PROGRAM_DELTAGELSE) {
        return brukerHarFyltUtTiltakssteg(svar);
    } else if (steg === Søknadssteg.ANDRE_UTBETALINGER) {
        return brukerHarFyltUtTiltakssteg(svar) &&
               brukerHarFyltUtProgramDeltagelseSteg(svar);
    } else if (steg === Søknadssteg.INSTITUSJONSOPPHOLD) {
            return (
                brukerHarFyltUtTiltakssteg(svar) &&
                brukerHarFyltUtProgramDeltagelseSteg(svar) &&
                brukerHarFyltUtAndreUtbetalingerSteg(svar)
            );
    } else if (steg === Søknadssteg.BARNETILLEGG) {
            return (
                brukerHarFyltUtTiltakssteg(svar) &&
                brukerHarFyltUtProgramDeltagelseSteg(svar) &&
                brukerHarFyltUtAndreUtbetalingerSteg(svar) &&
                brukerHarFyltUtInstitusjonsoppholdSteg(svar)
            );
    } else if (steg === Søknadssteg.OPPSUMMERING) {
        // todo: Sjekk at bruker har fylt ut steget om barnetillegg når det er klart
            return (
                brukerHarFyltUtTiltakssteg(svar) &&
                brukerHarFyltUtProgramDeltagelseSteg(svar) &&
                brukerHarFyltUtAndreUtbetalingerSteg(svar) &&
                brukerHarFyltUtInstitusjonsoppholdSteg(svar)
            );
    } else if (steg === Søknadssteg.KVITTERING) {
        return (
            brukerHarFyltUtTiltakssteg(svar) &&
            brukerHarFyltUtProgramDeltagelseSteg(svar) &&
            brukerHarFyltUtAndreUtbetalingerSteg(svar) &&
            brukerHarFyltUtOppsummeringssteg(svar)
        );
    }
}
