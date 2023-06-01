import { Periode } from '@/types/Periode';
import { formatDate } from '@/utils/formatDate';
import {Nullable} from "@/utils/eller-null";

export function formatPeriode(periode: Nullable<Periode>) {
    if (!periode) return '';
    return `${formatDate(periode.fra)} - ${formatDate(periode.til)}`;
}
