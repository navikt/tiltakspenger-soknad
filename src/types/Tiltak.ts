import { Periode } from '@/types/Periode';
import { InnsendteSvar } from '@/types/InnsendteSvar';

/** Utfallet av behandlingen av en søknad, når vedtaket er iverksatt. */
export interface Behandlingsutfall {
    resultat: 'INNVILGELSE' | 'AVSLAG';
    vedtakstidspunkt: string;
}

/** Den sist mottatte søknaden for tiltaket som dekker hele perioden, se `tidligereSøknad` på {@link Tiltak}. */
export interface TidligereSøknad {
    mottatt: string;
    svar: InnsendteSvar;
    /** Satt når søknaden er ferdig behandlet. Da kan bruker sende den samme søknaden på nytt. */
    behandlingsutfall?: Behandlingsutfall | null;
}

export interface Tiltak {
    aktivitetId: string;
    type: string;
    typeNavn: string;
    arenaRegistrertPeriode?: Periode;
    arrangør: string;
    gjennomforingId: string;
    visningsnavn?: string;
    /**
     * Satt når bruker allerede har søkt for tiltaket og perioden.
     * Bruker kan søke på nytt, men får først se svarene fra forrige søknad.
     * Er forrige søknad ikke ferdig behandlet, avvises den nye søknaden om svarene er de samme.
     */
    tidligereSøknad?: TidligereSøknad | null;
}
