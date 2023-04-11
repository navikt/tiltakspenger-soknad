import { Periode } from '@/types/Periode';
import { AnnenUtbetaling } from '@/types/AnnenUtbetaling';
import { SelvregistrertBarn } from '@/types/Barn';

interface Søknad {
    svar: Spørsmålsbesvarelser;
    vedlegg: File[];
}

export interface Spørsmålsbesvarelser {
    deltarIKvp: boolean;
    periodeMedKvp?: Periode;
    deltarIIntroprogrammet: boolean;
    periodeMedIntroprogrammet?: Periode;
    borPåInstitusjon: boolean;
    institusjonstype?: string;
    valgtAktivitetId: string;
    søkerHeleTiltaksperioden: boolean;
    overskrevetTiltaksperiode?: Periode;
    søkerOmBarnetillegg: boolean;
    manueltRegistrerteBarnSøktBarnetilleggFor: SelvregistrertBarn[];
    registrerteBarnSøktBarnetilleggFor: string[];
    mottarEllerSøktPensjonsordning: boolean;
    pensjon: AnnenUtbetaling;
    mottarEllerSøktEtterlønn: boolean;
    etterlønn: AnnenUtbetaling;
}

export default Søknad;
