import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Radio, RadioGroup } from '@navikt/ds-react';

interface JaNeiSpørsmålProps {
    children: string;
    name: string;
}

export default function JaNeiSpørsmål({ children, name }: JaNeiSpørsmålProps) {
    const { control } = useFormContext();
    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { value, name, onBlur, onChange } }) => (
                <RadioGroup
                    legend={children}
                    value={value === true ? 'ja' : value === false ? 'nei' : ''}
                    name={name}
                    onBlur={onBlur}
                    onChange={(value) => onChange(value === 'ja')}
                >
                    <Radio value="ja">Ja</Radio>
                    <Radio value="nei">Nei</Radio>
                </RadioGroup>
            )}
        />
    );
}
