import { Periode } from '@/types/Periode';
import { Oppholdssted } from '@/utils/bosted';

/**
 * Svarene i en søknad slik de sendes inn til, og hentes tilbake fra, søknad-api-et.
 * Formen er den `toSøknadJson` lager av skjemasvarene: perioder og datoer følger bare med for ja-svar, og barna har oppholdssted i stedet for bosted-spørsmålene.
 */
export interface InnsendteSvar {
    tiltak: InnsendtTiltak;
    kvalifiseringsprogram: { deltar: boolean; periode?: Periode | null };
    introduksjonsprogram: { deltar: boolean; periode?: Periode | null };
    institusjonsopphold: { borPåInstitusjon: boolean; periode?: Periode | null };
    mottarAndreUtbetalinger: boolean;
    sykepenger: InnsendtUtbetaling;
    gjenlevendepensjon: InnsendtUtbetaling;
    alderspensjon: { mottar: boolean; fraDato?: string | null };
    supplerendestønadover67: InnsendtUtbetaling;
    supplerendestønadflyktninger: InnsendtUtbetaling;
    pensjonsordning: InnsendtUtbetaling;
    etterlønn: { mottar: boolean };
    jobbsjansen: InnsendtUtbetaling;
    barnetillegg: InnsendtBarnetillegg;
    harBekreftetAlleOpplysninger: boolean;
    harBekreftetÅSvareSåGodtManKan: boolean;
}

export interface InnsendtTiltak {
    aktivitetId: string;
    periode: Periode;
    arenaRegistrertPeriode?: Partial<Periode> | null;
    arrangør: string;
    type: string;
    typeNavn: string;
    gjennomforingId?: string | null;
    visningsnavn?: string | null;
}

export interface InnsendtUtbetaling {
    mottar: boolean;
    periode?: Periode | null;
}

export interface InnsendtBarnetillegg {
    søkerOmBarnetillegg?: boolean | null;
    manueltRegistrerteBarnSøktBarnetilleggFor: InnsendtBarn[];
    registrerteBarnSøktBarnetilleggFor: InnsendtRegistrertBarn[];
}

export interface InnsendtBarn {
    fornavn?: string | null;
    mellomnavn?: string | null;
    etternavn?: string | null;
    fødselsdato: string;
    oppholdssted?: Oppholdssted | null;
}

export interface InnsendtRegistrertBarn extends InnsendtBarn {
    fnr: string;
}
