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

export interface FormTiltak {
    aktivitetId: string;
    periode?: Periode;
    søkerHeleTiltaksperioden: boolean;
    arenaRegistrertPeriode?: Periode;
}

export interface Barnetillegg {
    søkerOmBarnetillegg: boolean;
    ønskerÅSøkeBarnetilleggForAndreBarn: boolean;
    manueltRegistrerteBarnSøktBarnetilleggFor: SelvregistrertBarn[];
    registrerteBarnSøktBarnetilleggFor: string[];
}

export interface Pensjonsordning {
    jaNei: boolean;
    utbetaler: string;
    periode: Periode;
}

export interface Etterlønn {
    jaNei: boolean;
    utbetaler: string;
    periode: Periode;
}

interface Spørsmålsbesvarelser {
    kvalifiseringsprogram: Kvalifiseringsprogram;
    introduksjonsprogram: Introduksjonsprogram;
    institusjonsopphold: Institusjonsopphold;
    tiltak: FormTiltak;
    mottarAndreUtbetalinger: boolean;
    barnetillegg: Barnetillegg;
    pensjonsordning: Pensjonsordning;
    etterlønn: Etterlønn;
    harBekreftetAlleOpplysninger: boolean;
}

export default Spørsmålsbesvarelser;
