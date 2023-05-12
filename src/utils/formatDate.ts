import dayjs from 'dayjs';
import {Nullable} from "@/utils/eller-null";

export function formatDate(dateString: string) {
    return dayjs(dateString).format('DD.MM.YYYY');
}

export const dateStrWithMonthName = (dateStr: Nullable<string>): string => {
    if (!dateStr) return '';
    return dayjs(dateStr).format('DD. MMMM YYYY')
}

export const dateStrWithHourMinute = (dateStr: Nullable<string>): string => {
    if (!dateStr) return '';
    return dayjs(dateStr).format('H.mm')
}
