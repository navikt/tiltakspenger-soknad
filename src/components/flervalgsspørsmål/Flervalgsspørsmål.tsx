import React from 'react';
import { Controller, useFormContext, get } from 'react-hook-form';
import { RadioGroup, Radio, ReadMore } from '@navikt/ds-react';
import { ValidatorFunction } from '@/types/ValidatorFunction';
import { Hjelpetekst } from '@/types/Hjelpetekst';

interface Svaralternativ {
    tekst: string;
    value: string;
}

interface FlervalgsspørsmålProps {
    alternativer: Svaralternativ[];
    name: string;
    children: string;
    validate?: ValidatorFunction;
    hjelpetekst?: Hjelpetekst;
    afterOnChange?: () => void;
}
export default function Flervalgsspørsmål({
    name,
    alternativer,
    children,
    validate,
    hjelpetekst,
    afterOnChange,
}: FlervalgsspørsmålProps) {
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
                onChange={(event) => {
                    onChange(event)
                    afterOnChange && afterOnChange()
                }}
                    error={errorMessage}
                >
                    {hjelpetekst && <ReadMore header={hjelpetekst.tittel}>{hjelpetekst.tekst}</ReadMore>}
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
