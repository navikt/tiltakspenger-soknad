import { Periode } from '@/types/Periode';
import { formatDate } from '@/utils/formatDate';
import { FormPeriode } from '@/types/FormPeriode';

export function formatPeriode(periode: Periode | FormPeriode) {
    return `${formatDate(periode.fra)} - ${formatDate(periode.til)}`;
}
