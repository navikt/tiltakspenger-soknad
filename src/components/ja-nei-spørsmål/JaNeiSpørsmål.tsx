import React from 'react';
import { Controller, get, useFormContext } from 'react-hook-form';
import { Radio, RadioGroup, ReadMore } from '@navikt/ds-react';
import { Hjelpetekst } from '@/types/Hjelpetekst';

interface JaNeiSpørsmålProps {
    children: string | React.ReactNode;
    name: string;
    validate?: (value: any) => string | undefined;
    hjelpetekst?: Hjelpetekst;
    description?: string | JSX.Element;
    reverse?: boolean;
}

export default function JaNeiSpørsmål({ children, name, validate, hjelpetekst, description, reverse }: JaNeiSpørsmålProps) {
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
                    id={name}
                    legend={children}
                    description={description}
                    value={value === true ? 'ja' : value === false ? 'nei' : ''}
                    name={name}
                    onBlur={onBlur}
                    onChange={(value) => onChange(value === 'ja')}
                    {...errorObject}
                >
                    {hjelpetekst && <ReadMore header={hjelpetekst.tittel}>{hjelpetekst.tekst}</ReadMore>}
                    {!reverse && <Radio value="nei">Nei</Radio>}
                    <Radio value="ja">Ja</Radio>
                    {reverse && <Radio value="nei">Nei</Radio>}
                </RadioGroup>
            )}
        />
    );
}
