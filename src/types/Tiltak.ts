import { Periode } from '@/types/Periode';

export interface Tiltak {
    aktivitetId: string;
    type: string;
    typeNavn: string;
    deltakelsePeriode: Periode;
    arrangør: string;
    status: string;
}
