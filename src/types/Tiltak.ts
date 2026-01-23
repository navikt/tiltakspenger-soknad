import { Periode } from '@/types/Periode';

export interface Tiltak {
    aktivitetId: string;
    type: string;
    typeNavn: string;
    arenaRegistrertPeriode?: Periode;
    arrangør: string;
    gjennomforingId: string;
    visningsnavn?: string;
}
