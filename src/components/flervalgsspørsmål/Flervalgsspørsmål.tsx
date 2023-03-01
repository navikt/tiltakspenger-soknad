import React from 'react';
import { Controller, useFormContext, get } from 'react-hook-form';
import { RadioGroup, Radio } from '@navikt/ds-react';
import { ValidatorFunction } from '@/types/ValidatorFunction';

interface Svaralternativ {
    tekst: string;
    value: string;
}

interface FlervalgsspørsmålProps {
    alternativer: Svaralternativ[];
    name: string;
    children: string;
    validate?: ValidatorFunction;
}
export default function Flervalgsspørsmål({ name, alternativer, children, validate }: FlervalgsspørsmålProps) {
    const { control, formState } = useFormContext();
    const errorMessage = get(formState.errors, name)?.message;
    return (
        <Controller
            name={name}
            control={control}
            rules={{ validate }}
            render={({ field: { value, name, onBlur, onChange } }) => (
                <RadioGroup
                    id={name}
                    legend={children}
                    value={value || ''}
                    name={name}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={errorMessage}
                >
                    {alternativer.map((alternativ) => (
                        <Radio value={alternativ.value} key={alternativ.value}>
                            {alternativ.tekst}
                        </Radio>
                    ))}
                </RadioGroup>
            )}
        />
    );
}
