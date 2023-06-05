import { UNSAFE_DatePicker, UNSAFE_useDatepicker } from '@navikt/ds-react';
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
    const { datepickerProps, inputProps } = UNSAFE_useDatepicker({
        onDateChange,
        fromDate: minDate,
        toDate: datoMåVæreIFortid ? new Date() : maxDate,
        defaultSelected: defaultSelected,
        onValidate: (val) => {
            setHasError(!val.isValidDate);
        },
    });

    const [hasError, setHasError] = useState(false);

    return (
        <UNSAFE_DatePicker {...datepickerProps} id={id}>
            <UNSAFE_DatePicker.Input {...inputProps} label={label} error={hasError && errorMessage} id={id} />
        </UNSAFE_DatePicker>
    );
}
