import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { TextField, TextFieldProps } from '@navikt/ds-react';

interface FritekstspørsmålProps {
    name: string;
    children: string;
    textFieldProps?: Partial<TextFieldProps>;
}

export default function Fritekstspørsmål({ name, children, textFieldProps }: FritekstspørsmålProps) {
    const { control } = useFormContext();
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <TextField label={children} {...textFieldProps} {...field} value={field.value || ''} />
            )}
        />
    );
}
