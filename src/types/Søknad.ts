export interface Barn {
    fornavn: string;
    etternavn: string;
    fdato: string;
    bostedsland: string;
}

interface Periode {
    fra: string;
    til: string;
}

interface AnnenUtbetaling {
    utbetaler: string;
    periode: Periode;
}

interface Søknad {
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
    barnSøktBarnetilleggFor: Barn[];
    mottarEllerSøktPensjonsordning: boolean;
    pensjon: AnnenUtbetaling;
    mottarEllerSøktEtterlønn: boolean;
    etterlønn: AnnenUtbetaling;
}

export default Søknad;
