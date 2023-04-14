import { Periode } from '@/types/Periode';
import { SelvregistrertBarn } from '@/types/Barn';

interface Introduksjonsprogram {
    deltar: boolean;
    periode?: Periode;
}

interface Kvalifiseringsprogram {
    deltar: boolean;
    periode?: Periode;
}

interface Institusjonsopphold {
    borPåInstitusjon: boolean;
    periode?: Periode;
}

interface Tiltak {
    aktivitetId: string;
    periode: Periode;
    søkerHeleTiltaksperioden: boolean;
}

interface Barnetillegg {
    søkerOmBarnetillegg: boolean;
    ønskerÅSøkeBarnetilleggForAndreBarn: boolean;
    manueltRegistrerteBarnSøktBarnetilleggFor: SelvregistrertBarn[];
    registrerteBarnSøktBarnetilleggFor: string[];
}

interface Pensjonsordning {
    mottarEllerSøktPensjonsordning: boolean;
    utbetaler: string;
    periode: Periode;
}

interface Etterlønn {
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
