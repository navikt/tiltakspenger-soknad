import { Periode } from '@/types/Periode';
import { Barn } from '@/types/Barn';

export interface Introduksjonsprogram {
    deltar: boolean;
    periode?: Periode;
}

export interface Kvalifiseringsprogram {
    deltar: boolean;
    periode?: Periode;
}

export interface Institusjonsopphold {
    borPåInstitusjon: boolean;
    periode?: Periode;
}

export interface FormTiltak {
    aktivitetId: string;
    periode?: Periode;
    søkerHeleTiltaksperioden: boolean;
    arenaRegistrertPeriode?: Periode;
}

export interface Barnetillegg {
    søkerOmBarnetillegg: boolean;
    ønskerÅSøkeBarnetilleggForAndreBarn: boolean;
    manueltRegistrerteBarnSøktBarnetilleggFor: Barn[];
    eøsOppholdForBarnFraAPI: Record<string, boolean>;
    kladd: Barn
}

export interface Pensjonsordning {
    mottar: boolean;
}

export interface Etterlønn {
    mottar: boolean;
}

export interface Sykepenger {
    mottar: boolean;
    periode: Periode;
}

export interface Gjenlevendepensjon {
    mottar: boolean;
    periode: Periode;
}

export interface Alderspensjon {
    mottar: boolean;
    fraDato: string;
}

export interface Supplerendestønadover67 {
    mottar: boolean;
    periode: Periode;
}

export interface Supplerendestønadflyktninger {
    mottar: boolean;
    periode: Periode;
}

export interface Jobbsjansen {
    mottar: boolean;
    periode: Periode;
}

interface Spørsmålsbesvarelser {
    kvalifiseringsprogram: Kvalifiseringsprogram;
    introduksjonsprogram: Introduksjonsprogram;
    institusjonsopphold: Institusjonsopphold;
    tiltak: FormTiltak;
    mottarAndreUtbetalinger: boolean;
    sykepenger: Sykepenger;
    gjenlevendepensjon: Gjenlevendepensjon;
    alderspensjon: Alderspensjon;
    supplerendestønadover67: Supplerendestønadover67;
    supplerendestønadflyktninger: Supplerendestønadflyktninger;
    pensjonsordning: Pensjonsordning;
    etterlønn: Etterlønn;
    jobbsjansen: Jobbsjansen;
    barnetillegg: Barnetillegg;
    harBekreftetAlleOpplysninger: boolean;
    harBekreftetÅSvareSåGodtManKan: boolean;
}

export default Spørsmålsbesvarelser;
