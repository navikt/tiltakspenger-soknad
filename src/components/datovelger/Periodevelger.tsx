import { ErrorMessage, UNSAFE_DatePicker, UNSAFE_useDatepicker } from '@navikt/ds-react';
import React from 'react';

export interface PeriodevelgerPeriode {
    fra?: Date;
    til?: Date;
}

interface PeriodevelgerProps {
    onFromChange: (date: Date | undefined) => void;
    onToChange: (date: Date | undefined) => void;
    defaultValue?: PeriodevelgerPeriode | null;
    errorMessage?: string;
    id?: string;
    minDate?: Date;
    maxDate?: Date;
}

export default function Periodevelger({
    onFromChange,
    onToChange,
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
        onDateChange: (date) => {
            onFromChange(date);
        },
        defaultSelected: defaultValue?.fra,
        fromDate: minDate,
        toDate: maxDate,
        defaultMonth: minDate,
    });

    const toDatePicker = UNSAFE_useDatepicker({
        onDateChange: (date) => {
            onToChange(date);
        },
        defaultSelected: defaultValue?.til,
        fromDate: minDate,
        toDate: maxDate,
        defaultMonth: maxDate,
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
