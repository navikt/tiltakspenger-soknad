import { Periode } from '@/types/Periode';
import { formatDate } from '@/utils/formatDate';
import { Nullable } from '@/utils/eller-null';
import { FormPeriode } from '@/types/FormPeriode';

export function formatPeriode(periode: Nullable<Periode> | FormPeriode) {
    if (!periode) return '';
    return `${formatDate(periode.fra)} - ${formatDate(periode.til)}`;
}
