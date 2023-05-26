import { UNSAFE_DatePicker, UNSAFE_useDatepicker } from '@navikt/ds-react';
import {ControllerRenderProps} from "react-hook-form";
import {formatDate} from "@/utils/formatDate";
import {fi} from "date-fns/locale";

interface DatovelgerProps {
    errorMessage?: string;
    id?: string;
    minDate?: Date;
    maxDate?: Date;
    label: string;
    datoMåVæreIFortid?: boolean;
    fieldProps:  ControllerRenderProps;
}

export default function Datovelger({
                                        errorMessage,
                                        id,
                                        label,
                                        maxDate,
                                        minDate,
                                        datoMåVæreIFortid,
                                        fieldProps,
                                    }: DatovelgerProps) {
    const { datepickerProps, inputProps } = UNSAFE_useDatepicker({
        onDateChange: fieldProps.onChange,
        fromDate: minDate,
        toDate: datoMåVæreIFortid ? new Date() : maxDate,
    });

    const dateFromForm = fieldProps.value ? formatDate((fieldProps.value)) : "";

    return (
        <UNSAFE_DatePicker {...datepickerProps} id={id}>
            <UNSAFE_DatePicker.Input
                label={label}
                error={errorMessage}
                id={id}
                {...inputProps}
                value={inputProps.value != "" ? inputProps.value : dateFromForm}
            />
        </UNSAFE_DatePicker>
    );
}

