import { ErrorMessage, UNSAFE_DatePicker, UNSAFE_useDatepicker } from '@navikt/ds-react';
import React, { useRef } from 'react';
import dayjs from 'dayjs';

export interface PeriodevelgerPeriode {
    fra?: Date;
    til?: Date;
}

interface PeriodevelgerProps {
    onFromChange: (date: Date | undefined) => void;
    onToChange: (date: Date | undefined) => void;
    value?: PeriodevelgerPeriode | null;
    errorMessage?: string;
    id?: string;
    minDate?: Date;
    maxDate?: Date;
}

export default function Periodevelger({
    onFromChange,
    onToChange,
    value,
    errorMessage,
    id,
    minDate,
    maxDate,
}: PeriodevelgerProps) {
    const flagg = useRef(false);

    React.useEffect(() => {
        fromDatePicker.setSelected(value?.fra);
        toDatePicker.setSelected(value?.til);
        flagg.current = true;
    }, [value]);

    const fromDatePicker = UNSAFE_useDatepicker({
        onDateChange: (date) => {
            if (flagg.current) {
                onFromChange(date);
                flagg.current = false;
            }
        },
        defaultSelected: value?.fra,
        fromDate: minDate,
        toDate: maxDate,
        defaultMonth: minDate,
    });

    const toDatePicker = UNSAFE_useDatepicker({
        onDateChange: (date) => {
            if (flagg.current) {
                onToChange(date);
                flagg.current = false;
            }
        },
        defaultSelected: value?.til,
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
