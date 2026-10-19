import Spørsmålsbesvarelser from '@/types/Spørsmålsbesvarelser';
import { Søknadssteg } from '@/types/Søknadssteg';
import { Barn } from '@/types/Barn';
import { harSvartPåBosted } from '@/utils/bosted';

export function brukerHarFyltUtTiltakssteg({ tiltak: { aktivitetId, periode } }: Spørsmålsbesvarelser) {
    return !!aktivitetId && !!periode && !!periode.fra && !!periode.til;
}

export function brukerHarFyltUtProgramDeltagelseSteg({
    kvalifiseringsprogram,
    introduksjonsprogram,
}: Spørsmålsbesvarelser) {
    if (kvalifiseringsprogram.deltar === undefined || introduksjonsprogram.deltar === undefined) {
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
    const {
        mottarAndreUtbetalinger,
        sykepenger,
        alderspensjon,
        gjenlevendepensjon,
        pensjonsordning,
        etterlønn,
        supplerendestønadover67,
        supplerendestønadflyktninger,
        jobbsjansen,
    } = spørsmålsbesvarelser;

    if (mottarAndreUtbetalinger === undefined) {
        return false;
    }

    if (etterlønn === undefined) {
        return false;
    }

    if (sykepenger === undefined) {
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

    if (jobbsjansen && jobbsjansen.mottar) {
        if (!jobbsjansen.periode) {
            return false;
        }
    }

    if (pensjonsordning && pensjonsordning.mottar) {
        if (!pensjonsordning.periode) {
            return false;
        }
    }

    if (supplerendestønadover67 && supplerendestønadover67.mottar) {
        if (!supplerendestønadover67.periode) {
            return false;
        }
    }

    if (supplerendestønadflyktninger && supplerendestønadflyktninger.mottar) {
        if (!supplerendestønadflyktninger.periode) {
            return false;
        }
    }

    if (
        mottarAndreUtbetalinger &&
        !(
            (gjenlevendepensjon && gjenlevendepensjon.mottar) ||
            (alderspensjon && alderspensjon.mottar) ||
            (jobbsjansen && jobbsjansen.mottar) ||
            (supplerendestønadover67 && supplerendestønadover67.mottar) ||
            (supplerendestønadflyktninger && supplerendestønadflyktninger.mottar) ||
            (pensjonsordning && pensjonsordning.mottar)
        )
    ) {
        return false;
    }

    return true;
}

export function brukerHarFyltUtBarnetilleggsteg(
    { barnetillegg }: Spørsmålsbesvarelser,
    barnFraFolkeregisteret: Barn[] | undefined,
) {
    const { søkerOmBarnetillegg, manueltRegistrerteBarnSøktBarnetilleggFor, bostedForBarnFraFolkeregisteret } =
        barnetillegg;
    if (søkerOmBarnetillegg === undefined) {
        return false;
    }
    if (!søkerOmBarnetillegg) {
        return true;
    }
    if (!barnFraFolkeregisteret) {
        return false;
    }
    if (barnFraFolkeregisteret.length === 0 && manueltRegistrerteBarnSøktBarnetilleggFor.length === 0) {
        return false;
    }
    return (
        barnFraFolkeregisteret.every(({ uuid }) => harSvartPåBosted(bostedForBarnFraFolkeregisteret[uuid])) &&
        manueltRegistrerteBarnSøktBarnetilleggFor.every(harSvartPåBosted)
    );
}

export function brukerHarFyltUtOppsummeringssteg({ harBekreftetAlleOpplysninger }: Spørsmålsbesvarelser) {
    return harBekreftetAlleOpplysninger;
}

export function brukerHarFyltUtNødvendigeOpplysninger(
    svar: Spørsmålsbesvarelser,
    steg: Søknadssteg | null,
    barnFraFolkeregisteret?: Barn[],
) {
    if (steg === Søknadssteg.TILTAK) {
        return svar.harBekreftetÅSvareSåGodtManKan;
    } else if (steg === Søknadssteg.TIDLIGERE_SØKNAD || steg === Søknadssteg.PROGRAM_DELTAGELSE) {
        return brukerHarFyltUtTiltakssteg(svar);
    } else if (steg === Søknadssteg.ANDRE_UTBETALINGER) {
        return brukerHarFyltUtTiltakssteg(svar) && brukerHarFyltUtProgramDeltagelseSteg(svar);
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
    } else if (steg === Søknadssteg.BARNETILLEGG_BARN) {
        return (
            brukerHarFyltUtTiltakssteg(svar) &&
            brukerHarFyltUtProgramDeltagelseSteg(svar) &&
            brukerHarFyltUtAndreUtbetalingerSteg(svar) &&
            brukerHarFyltUtInstitusjonsoppholdSteg(svar) &&
            svar.barnetillegg.søkerOmBarnetillegg === true
        );
    } else if (steg === Søknadssteg.OPPSUMMERING) {
        return (
            brukerHarFyltUtTiltakssteg(svar) &&
            brukerHarFyltUtProgramDeltagelseSteg(svar) &&
            brukerHarFyltUtAndreUtbetalingerSteg(svar) &&
            brukerHarFyltUtInstitusjonsoppholdSteg(svar) &&
            brukerHarFyltUtBarnetilleggsteg(svar, barnFraFolkeregisteret)
        );
    } else if (steg === Søknadssteg.KVITTERING) {
        return (
            brukerHarFyltUtTiltakssteg(svar) &&
            brukerHarFyltUtProgramDeltagelseSteg(svar) &&
            brukerHarFyltUtAndreUtbetalingerSteg(svar) &&
            brukerHarFyltUtOppsummeringssteg(svar)
        );
    } else {
        return false;
    }
}
