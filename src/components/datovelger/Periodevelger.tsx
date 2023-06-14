import { ErrorMessage, UNSAFE_DatePicker, UNSAFE_useDatepicker } from '@navikt/ds-react';
import React from 'react';

export interface PeriodevelgerPeriode {
    fra?: Date;
    til?: Date;
}

interface PeriodevelgerProps {
    onFromChange: (date: Date | undefined) => void;
    onToChange: (date: Date | undefined) => void;
    defaultSelected?: PeriodevelgerPeriode | null;
    errorMessage?: string;
    id?: string;
    minDate?: Date;
    maxDate?: Date;
    disabledFra?: boolean;
    disabledTil?: boolean;
}

export default function Periodevelger({
    onFromChange,
    onToChange,
    defaultSelected,
    errorMessage,
    id,
    minDate,
    maxDate,
    disabledFra,
    disabledTil,
}: PeriodevelgerProps) {
    const fromDatePicker = UNSAFE_useDatepicker({
        onDateChange: (date) => {
            onFromChange(date);
        },
        defaultSelected: defaultSelected?.fra,
        fromDate: minDate,
        toDate: maxDate,
        defaultMonth: minDate ?? maxDate,
    });

    const toDatePicker = UNSAFE_useDatepicker({
        onDateChange: (date) => {
            onToChange(date);
        },
        defaultSelected: defaultSelected?.til,
        fromDate: minDate,
        toDate: maxDate,
        defaultMonth: maxDate ?? minDate,
    });

    return (
        <>
            <div style={{ display: 'flex', gap: '1rem', paddingBottom: '0.5rem' }}>
                <UNSAFE_DatePicker {...fromDatePicker.datepickerProps}>
                    <UNSAFE_DatePicker.Input
                        {...fromDatePicker.inputProps}
                        label="Fra"
                        id={`${id}.fra`}
                        error={!!errorMessage}
                        disabled={disabledFra}
                        aria-controls={`${id}.fra`}
                        aria-label="fra"
                    />
                </UNSAFE_DatePicker>
                <UNSAFE_DatePicker {...toDatePicker.datepickerProps}>
                    <UNSAFE_DatePicker.Input
                        {...toDatePicker.inputProps}
                        label="Til"
                        id={`${id}.til`}
                        error={!!errorMessage}
                        disabled={disabledTil}
                        aria-controls={`${id}.til`}
                        aria-label="til"
                    />
                </UNSAFE_DatePicker>
            </div>
            {errorMessage ? <ErrorMessage size={'small'}>{`• ${errorMessage}`}</ErrorMessage> : ''}
        </>
    );
}
