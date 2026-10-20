import { Periode } from '@/types/Periode';
import { InnsendteSvar } from '@/types/InnsendteSvar';

/** Den sist mottatte søknaden for tiltaket som dekker hele perioden, se `tidligereSøknad` på {@link Tiltak}. */
export interface TidligereSøknad {
    mottatt: string;
    svar: InnsendteSvar;
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
     * Bruker kan søke på nytt, men får først se svarene fra forrige søknad, og den nye søknaden avvises om svarene er de samme.
     */
    tidligereSøknad?: TidligereSøknad | null;
}
