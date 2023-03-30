import { Periode } from '@/types/Periode';

export interface Tiltak {
    aktivitetId: string;
    type: string;
    deltakelsePeriode: Periode;
    arrangør: string;
    status: string;
}
