import { Periode } from '@/types/Periode';
import { formatDate } from '@/utils/formatDate';

export function formatPeriode(periode: Periode) {
    return `${formatDate(periode.fra)} - ${formatDate(periode.til)}`;
}
