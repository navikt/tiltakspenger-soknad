import { UNSAFE_DatePicker, UNSAFE_useDatepicker } from '@navikt/ds-react';

interface DatovelgerProps {
    onDateChange: (dato: Date | undefined) => void;
    label: string;
}

export default function Datovelger({ onDateChange, label }: DatovelgerProps) {
    const { datepickerProps, inputProps } = UNSAFE_useDatepicker({
        onDateChange,
    });

    return (
        <UNSAFE_DatePicker {...datepickerProps}>
            <UNSAFE_DatePicker.Input {...inputProps} size="small" label={label} />
        </UNSAFE_DatePicker>
    );
}
