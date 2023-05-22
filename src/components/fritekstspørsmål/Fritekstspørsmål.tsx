import React from 'react';
import { Controller, get, useFormContext } from 'react-hook-form';
import { TextField, TextFieldProps } from '@navikt/ds-react';
import { ValidatorFunction } from '@/types/ValidatorFunction';

interface FritekstspørsmålProps {
    name: string;
    children: string;
    textFieldProps?: Partial<TextFieldProps>;
    validate?: ValidatorFunction;
}

export default function Fritekstspørsmål({
    name,
    children,
    textFieldProps,
    validate,
}: FritekstspørsmålProps) {
    const { control, formState } = useFormContext();
    const errorMessage = get(formState.errors, name)?.message;
    return (
        <Controller
            name={name}
            control={control}
            rules={{ validate }}
            render={({ field }) => (
                <TextField
                    id={name}
                    label={children}
                    {...textFieldProps}
                    {...field}
                    value={field.value || ''}
                    error={errorMessage}
                />
            )}
        />
    );
}
