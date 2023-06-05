import React from 'react';
import { Controller, get, useFormContext } from 'react-hook-form';
import { TextField, TextFieldProps } from '@navikt/ds-react';
import { ValidatorFunction } from '@/types/ValidatorFunction';

interface FritekstspørsmålProps {
    name: string;
    children: string;
    textFieldProps?: Partial<TextFieldProps>;
    validate?: ValidatorFunction | ValidatorFunction[];
}

function validatorArrayAsObject(validate: ValidatorFunction[]) {
    const validateObject: { [key: string]: ValidatorFunction } = {};
    validate.forEach((validatorFunction, index) => (validateObject[`${index}`] = validatorFunction));
    return validateObject;
}

function setupValidation(validate?: ValidatorFunction | ValidatorFunction[]) {
    if (Array.isArray(validate)) {
        return validatorArrayAsObject(validate);
    }
    return validate;
}

export default function Fritekstspørsmål({ name, children, textFieldProps, validate }: FritekstspørsmålProps) {
    const { control, formState } = useFormContext();
    const errorMessage = get(formState.errors, name)?.message;
    return (
        <Controller
            name={name}
            control={control}
            rules={{ validate: setupValidation(validate) }}
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
