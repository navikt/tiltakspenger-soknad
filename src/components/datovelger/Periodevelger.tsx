import { ErrorMessage, UNSAFE_DatePicker, UNSAFE_useDatepicker } from '@navikt/ds-react';
import { DateRange } from 'react-day-picker';
import React from 'react';

export interface PeriodevelgerPeriode {
    fra?: Date;
    til?: Date;
}

interface PeriodevelgerProps {
    onRangeChange: (periode: DateRange | undefined) => void;
    defaultValue?: PeriodevelgerPeriode | null;
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
    React.useEffect(() => {
        fromDatePicker.setSelected(defaultValue?.fra);
        toDatePicker.setSelected(defaultValue?.til);
    }, [defaultValue]);

    const fromDatePicker = UNSAFE_useDatepicker({
        onDateChange: (d) => {
            onRangeChange({ from: d, to: undefined });
        },
        defaultSelected: defaultValue?.fra,
        fromDate: minDate,
    });

    const toDatePicker = UNSAFE_useDatepicker({
        onDateChange: (d) => {
            onRangeChange({ from: undefined, to: d });
        },
        defaultSelected: defaultValue?.til,
        toDate: maxDate,
    });

    return (
        <>
            <div style={{ display: 'flex', gap: '1rem', paddingBottom: '0.5rem' }}>
                <UNSAFE_DatePicker {...fromDatePicker.datepickerProps}>
                    <UNSAFE_DatePicker.Input
                        {...fromDatePicker.inputProps}
                        size="small"
                        label="Fra"
                        id={`${id}.fra`}
                        error={!!errorMessage}
                    />
                </UNSAFE_DatePicker>
                <UNSAFE_DatePicker {...toDatePicker.datepickerProps}>
                    <UNSAFE_DatePicker.Input
                        {...toDatePicker.inputProps}
                        size="small"
                        label="Til"
                        id={`${id}.til`}
                        error={!!errorMessage}
                    />
                </UNSAFE_DatePicker>
            </div>
            {errorMessage ? <ErrorMessage size={'small'}>{`• ${errorMessage}`}</ErrorMessage> : ''}
        </>
    );
}
