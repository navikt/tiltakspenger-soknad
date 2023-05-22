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
    mottarEllerSøktPensjonsordning: boolean;
    utbetaler: string;
    periode: Periode;
}

export interface Etterlønn {
    mottarEllerSøktEtterlønn: boolean;
    utbetaler: string;
    periode: Periode;
}

interface Spørsmålsbesvarelser {
    kvalifiseringsprogram: Kvalifiseringsprogram;
    introduksjonsprogram: Introduksjonsprogram;
    institusjonsopphold: Institusjonsopphold;
    tiltak: FormTiltak;
    barnetillegg: Barnetillegg;
    pensjonsordning: Pensjonsordning;
    etterlønn: Etterlønn;
    harBekreftetAlleOpplysninger: boolean;
}

export default Spørsmålsbesvarelser;
