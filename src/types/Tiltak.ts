import { Periode } from '@/types/Periode';
import { InnsendteSvar } from '@/types/InnsendteSvar';

/** Utfallet av behandlingen av en søknad, når vedtaket er iverksatt eller søknaden er avbrutt. */
export interface Behandlingsutfall {
    resultat: 'INNVILGELSE' | 'AVSLAG' | 'AVBRUTT';
    /** Når vedtaket ble fattet, eller når søknaden ble avbrutt. */
    tidspunkt: string;
}

/** Den sist mottatte søknaden for tiltaket som dekker hele perioden, se `tidligereSøknad` på {@link Tiltak}. */
export interface TidligereSøknad {
    mottatt: string;
    svar: InnsendteSvar;
    /** Satt når søknaden er ferdig behandlet. Da kan bruker sende den samme søknaden på nytt. */
    behandlingsutfall?: Behandlingsutfall | null;
}

/** Det nyeste vedtaket på en søknad for tiltaket, se `sisteVedtak` på {@link Tiltak}. */
export interface SisteVedtak {
    /**
     * Når vi mottok søknaden vedtaket gjelder.
     * Det er alltid en eldre søknad enn `tidligereSøknad`, siden en søknad med vedtak ikke behandles på nytt.
     */
    søknadMottatt: string;
    /** Alltid innvilgelse eller avslag. */
    behandlingsutfall: Behandlingsutfall;
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
    /**
     * Satt når en eldre søknad for tiltaket og perioden har fått vedtak, men `tidligereSøknad` ikke har det.
     * Da er den sist mottatte søknaden under behandling, avbrutt eller gjenåpnet, og bruker skal fortsatt se vedtaket.
     */
    sisteVedtak?: SisteVedtak | null;
}
