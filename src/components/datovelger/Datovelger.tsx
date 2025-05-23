import { DatePicker, useDatepicker } from '@navikt/ds-react';
import { useState } from 'react';

interface DatovelgerProps {
    onDateChange: (date: Date | undefined) => void;
    errorMessage?: string;
    id?: string;
    minDate?: Date;
    maxDate?: Date;
    label: string;
    datoMåVæreIFortid?: boolean;
    defaultSelected: Date;
}

export default function Datovelger({
    onDateChange,
    errorMessage,
    id,
    label,
    maxDate,
    minDate,
    datoMåVæreIFortid,
    defaultSelected,
}: DatovelgerProps) {
    const [dateError, setDateError] = useState<string>('');

    const { datepickerProps, inputProps } = useDatepicker({
        onDateChange,
        fromDate: minDate,
        defaultMonth: minDate,
        toDate: datoMåVæreIFortid ? new Date() : maxDate,
        defaultSelected: defaultSelected,
        onValidate: (validation) => {
            if (validation.isAfter) {
                setDateError('Dato kan ikke være i fremtiden');
            } else {
                setDateError('');
            }
        },
    });

    const computedError = dateError || errorMessage;

    return (
        <DatePicker {...datepickerProps} id={id}>
            <DatePicker.Input {...inputProps} label={label} error={computedError} autoComplete="off" id={id} />
        </DatePicker>
    );
}
