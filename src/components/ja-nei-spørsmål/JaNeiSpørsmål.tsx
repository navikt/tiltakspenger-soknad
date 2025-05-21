import React from 'react';
import { Controller, get, useFormContext } from 'react-hook-form';
import { Radio, RadioGroup, ReadMore } from '@navikt/ds-react';
import { Hjelpetekst } from '@/types/Hjelpetekst';
import { ValidatorFunction } from '@/types/ValidatorFunction';

interface JaNeiSpørsmålProps {
    children: string | React.ReactNode;
    name: string;
    validate?: ValidatorFunction | ValidatorFunction[];
    hjelpetekst?: Hjelpetekst;
    description?: string | React.ReactElement;
    reverse?: boolean;
    afterOnChange?: () => void;
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

export default function JaNeiSpørsmål({
    children,
    name,
    validate,
    hjelpetekst,
    description,
    reverse,
    afterOnChange,
}: JaNeiSpørsmålProps) {
    const { control, formState } = useFormContext();
    const errorMessage = get(formState.errors, name)?.message;
    const errorObject = errorMessage ? { error: <>{errorMessage}</> } : {};
    return (
        <Controller
            name={name}
            control={control}
            rules={{ validate: setupValidation(validate) }}
            render={({ field: { value, name, onBlur, onChange } }) => (
                <RadioGroup
                    id={name}
                    legend={children}
                    description={description}
                    value={value === true ? 'ja' : value === false ? 'nei' : ''}
                    name={name}
                    onBlur={onBlur}
                    onChange={(value) => {
                        onChange(value === 'ja');
                        afterOnChange && afterOnChange();
                    }}
                    {...errorObject}
                    tabIndex={-1}
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
