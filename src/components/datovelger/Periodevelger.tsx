import { UNSAFE_DatePicker, UNSAFE_useRangeDatepicker } from '@navikt/ds-react';
import { DateRange } from 'react-day-picker';

interface PeriodevelgerProps {
    onRangeChange: (periode: DateRange | undefined) => void;
    defaultValue?: DateRange | null;
    errorMessage?: string;
    id?: string;
    minDate?: Date;
    maxDate?: Date;
    ikkeVisTilDato?: boolean;
}

export default function Periodevelger({
    onRangeChange,
    defaultValue,
    errorMessage,
    id,
    minDate,
    maxDate,
    ikkeVisTilDato,
}: PeriodevelgerProps) {
    function getRangepickerProps() {
        if (defaultValue)
            return {
                defaultSelected: {
                    from: defaultValue.from,
                    to: defaultValue.to,
                },
            };
        else return {};
    }

    const { datepickerProps, toInputProps, fromInputProps } = UNSAFE_useRangeDatepicker({
        onRangeChange,
        ...getRangepickerProps(),
        fromDate: minDate,
        toDate: maxDate,
    });

    return (
        <UNSAFE_DatePicker {...datepickerProps} id={id}>
            <UNSAFE_DatePicker.Input
                {...fromInputProps}
                size="small"
                label="Fra"
                error={errorMessage}
                id={`${id}.fra`}
            />
            {!ikkeVisTilDato && <UNSAFE_DatePicker.Input {...toInputProps} size="small" label="Til" error={errorMessage} id={`${id}.til`} />}
        </UNSAFE_DatePicker>
    );
}
