import React from 'react';
import { Controller, get, useFormContext } from 'react-hook-form';
import { Radio, RadioGroup, ReadMore, Tag } from '@navikt/ds-react';
import { ValidatorFunction } from '@/types/ValidatorFunction';
import { Hjelpetekst } from '@/types/Hjelpetekst';

interface Svaralternativ {
    tekst: string;
    value: string;
    /** Kort merkelapp som vises etter teksten. */
    tag?: string;
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
                        onChange(event);
                        afterOnChange?.();
                    }}
                    error={errorMessage}
                    tabIndex={-1}
                >
                    {hjelpetekst && <ReadMore header={hjelpetekst.tittel}>{hjelpetekst.tekst}</ReadMore>}
                    {alternativer.map((alternativ) => (
                        <Radio value={alternativ.value} key={alternativ.value}>
                            {alternativ.tekst}
                            {alternativ.tag && (
                                <span style={{ display: 'block', marginTop: '0.25rem' }}>
                                    <Tag variant="info" size="xsmall">
                                        {alternativ.tag}
                                    </Tag>
                                </span>
                            )}
                        </Radio>
                    ))}
                </RadioGroup>
            )}
        />
    );
}
