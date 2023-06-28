import { ErrorMessage, UNSAFE_DatePicker, UNSAFE_useDatepicker } from '@navikt/ds-react';
import React, {useState} from 'react';

export interface PeriodevelgerPeriode {
    fra?: Date;
    til?: Date;
}

export interface RangeError {
    from?: string;
    to?: string;
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
    const [rangeError, setRangeError] = useState<RangeError>({});
    const fromDatePicker = UNSAFE_useDatepicker({
        onDateChange: (date) => {
            onFromChange(date);
        },
        defaultSelected: defaultSelected?.fra,
        fromDate: minDate,
        toDate: maxDate,
        defaultMonth: minDate ?? maxDate,
        onValidate: (validation) => {
            if (validation.isBefore || validation.isAfter) {
                setRangeError({from: 'Fra-dato kan ikke være utenfor tiltaksperioden'});
            } else {
                setRangeError({...rangeError, from: undefined});
            }
        },
    });

    const toDatePicker = UNSAFE_useDatepicker({
        onDateChange: (date) => {
            onToChange(date);
        },
        defaultSelected: defaultSelected?.til,
        fromDate: minDate,
        toDate: maxDate,
        defaultMonth: maxDate ?? minDate,
        openOnFocus: false,
        onValidate: (validation) => {
            if (validation.isBefore || validation.isAfter) {
                setRangeError({to: 'Til-dato kan ikke være utenfor tiltaksperioden'});
            } else {
                setRangeError({...rangeError, to: undefined});
            }
        },
    });

    const computedError = rangeError?.from || rangeError?.to || errorMessage;

    return (
        <>
            <div style={{ display: 'flex', gap: '1rem', paddingBottom: '0.5rem' }}>
                <UNSAFE_DatePicker {...fromDatePicker.datepickerProps}>
                    <UNSAFE_DatePicker.Input
                        {...fromDatePicker.inputProps}
                        label="Fra"
                        id={`${id}.fra`}
                        error={!!computedError}
                        disabled={disabledFra}
                        aria-controls={`${id}.fra`}
                        aria-label="fra"
                        autoComplete="off"
                    />
                </UNSAFE_DatePicker>
                <UNSAFE_DatePicker {...toDatePicker.datepickerProps}>
                    <UNSAFE_DatePicker.Input
                        {...toDatePicker.inputProps}
                        label="Til"
                        id={`${id}.til`}
                        error={!!computedError}
                        disabled={disabledTil}
                        aria-controls={`${id}.til`}
                        aria-label="til"
                        autoComplete="off"
                    />
                </UNSAFE_DatePicker>
            </div>
            {computedError ? <ErrorMessage size={'small'}>{`• ${computedError}`}</ErrorMessage> : ''}
        </>
    );
}
