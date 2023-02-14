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

type Tiltakstype = 'AMO' | 'ARBEIDSTRENING' | 'JOBBSØKERKURS' | 'ANNET';

interface Tiltak {
    type: Tiltakstype;
    periode: Periode;
    antallDagerIUken: number;
}

interface AnnenUtbetaling {
    utbetaler: string;
    periode: Periode;
}

interface Søknad {
    deltarIKvp: boolean;
    periodeMedKvp?: string;
    deltarIIntroprogrammet: boolean;
    periodeMedIntroprogrammet?: string;
    borPåInstitusjon: boolean;
    institusjonstype?: string;
    tiltak: Tiltak;
    søkerOmBarnetillegg: boolean;
    barnSøktBarnetilleggFor: Barn[];
    mottarEllerSøktPensjonsordning: boolean;
    pensjonsordning: AnnenUtbetaling;
    mottarEllerSøktEtterlønn: boolean;
    etterlønn: AnnenUtbetaling;
}

export default Søknad;
