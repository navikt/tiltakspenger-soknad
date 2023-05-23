import { UNSAFE_DatePicker, UNSAFE_useRangeDatepicker } from '@navikt/ds-react';
import { DateRange } from 'react-day-picker';

interface PeriodevelgerProps {
    onRangeChange: (periode: DateRange | undefined) => void;
    defaultValue?: DateRange | null;
    errorMessage?: string;
    id?: string;
    minDate?: Date;
    maxDate?: Date;
}

export default function Periodevelger({
    onRangeChange,
    defaultValue,
    errorMessage,
    id,
    minDate,
    maxDate,
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
                size="medium"
                label="Fra dato"
                error={errorMessage}
                id={`${id}.fra`}
            />
            <UNSAFE_DatePicker.Input {...toInputProps} size="medium" label="Til dato" error={errorMessage} id={`${id}.til`} />
        </UNSAFE_DatePicker>
    );
}
