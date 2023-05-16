import { UNSAFE_DatePicker, UNSAFE_useDatepicker } from '@navikt/ds-react';

interface DatovelgerProps {
    onDateChange: (date: Date | undefined) => void;
    errorMessage?: string;
    id?: string;
    minDate?: Date;
    maxDate?: Date;
    label: string;
    datoMåVæreIFortid?: boolean;
}

export default function Datovelger({
                                        onDateChange,
                                        errorMessage,
                                        id,
                                        label,
                                        maxDate,
                                        minDate,
                                        datoMåVæreIFortid,
                                    }: DatovelgerProps) {
    const { datepickerProps, inputProps } = UNSAFE_useDatepicker({
        onDateChange,
        fromDate: minDate,
        toDate: datoMåVæreIFortid ? new Date() : maxDate,
    });

    return (
        <UNSAFE_DatePicker {...datepickerProps} id={id}>
            <UNSAFE_DatePicker.Input
                {...inputProps}
                label={label}
                error={errorMessage}
                id={id}
            />
        </UNSAFE_DatePicker>
    );
}

