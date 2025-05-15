import dayjs from 'dayjs';
import { Nullable } from '@/utils/eller-null';
import 'dayjs/locale/nb';

dayjs.locale('nb');

export function formatDate(date: string | Date) {
    return dayjs(date).format('DD.MM.YYYY');
}

export const dateStrWithMonthName = (dateStr: Nullable<string>): string => {
    if (!dateStr) return '';
    return dayjs(dateStr).format('DD. MMMM YYYY');
};

export const dateStrWithHourMinute = (dateStr: Nullable<string>): string => {
    if (!dateStr) return '';
    return dayjs(dateStr).format('HH.mm');
};
