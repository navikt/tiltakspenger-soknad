import React from 'react';
import { Controller, get, useFormContext } from 'react-hook-form';
import { Checkbox, CheckboxGroup, ReadMore } from '@navikt/ds-react';
import { ValidatorFunction } from '@/types/ValidatorFunction';
import { Hjelpetekst } from '@/types/Hjelpetekst';

interface Svaralternativ {
    tekst: string;
    value: string;
}

interface CheckboxgruppespørsmålProps {
    alternativer: Svaralternativ[];
    name: string;
    children: string;
    validate?: ValidatorFunction;
    hjelpetekst?: Hjelpetekst;
}

export default function Checkboxgruppespørsmål({
    name,
    alternativer,
    children,
    validate,
    hjelpetekst,
}: CheckboxgruppespørsmålProps) {
    const { control, formState } = useFormContext();
    const errorMessage = get(formState.errors, name)?.message;
    return (
        <Controller
            name={name}
            control={control}
            rules={{ validate }}
            render={({ field: { value, name, onBlur, onChange } }) => (
                <CheckboxGroup
                    id={name}
                    legend={children}
                    value={value || ''}
                    name={name}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={errorMessage}
                >
                    {hjelpetekst && <ReadMore header={hjelpetekst.tittel}>{hjelpetekst.tekst}</ReadMore>}
                    {alternativer.map((alternativ) => (
                        <Checkbox value={alternativ.value} key={alternativ.value}>
                            {alternativ.tekst}
                        </Checkbox>
                    ))}
                </CheckboxGroup>
            )}
        />
    );
}
