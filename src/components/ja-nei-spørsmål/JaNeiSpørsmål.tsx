import React from 'react';
import { Controller, get, useFormContext } from 'react-hook-form';
import { Radio, RadioGroup } from '@navikt/ds-react';

interface JaNeiSpørsmålProps {
    children: string;
    name: string;
    validate?: (value: any) => string | undefined;
}

export default function JaNeiSpørsmål({ children, name, validate }: JaNeiSpørsmålProps) {
    const { control, formState } = useFormContext();
    const errorMessage = get(formState.errors, name)?.message;
    const errorObject = errorMessage ? { error: <>{errorMessage}</> } : {};
    return (
        <Controller
            name={name}
            control={control}
            rules={{ validate }}
            render={({ field: { value, name, onBlur, onChange } }) => (
                <RadioGroup
                    legend={children}
                    value={value === true ? 'ja' : value === false ? 'nei' : ''}
                    name={name}
                    onBlur={onBlur}
                    onChange={(value) => onChange(value === 'ja')}
                    {...errorObject}
                >
                    <Radio value="ja">Ja</Radio>
                    <Radio value="nei">Nei</Radio>
                </RadioGroup>
            )}
        />
    );
}
