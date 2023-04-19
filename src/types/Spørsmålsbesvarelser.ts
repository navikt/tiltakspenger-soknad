import { Periode } from '@/types/Periode';
import { SelvregistrertBarn } from '@/types/Barn';

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

interface Tiltak {
    aktivitetId: string;
    periode: Periode;
    søkerHeleTiltaksperioden: boolean;
}

export interface Barnetillegg {
    søkerOmBarnetillegg: boolean;
    ønskerÅSøkeBarnetilleggForAndreBarn: boolean;
    manueltRegistrerteBarnSøktBarnetilleggFor: SelvregistrertBarn[];
    registrerteBarnSøktBarnetilleggFor: string[];
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
    tiltak: Tiltak;
    barnetillegg: Barnetillegg;
    pensjonsordning: Pensjonsordning;
    etterlønn: Etterlønn;
}

export default Spørsmålsbesvarelser;
