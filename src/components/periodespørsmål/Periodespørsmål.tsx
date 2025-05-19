import React from 'react';
import { Controller, get, useFormContext } from 'react-hook-form';
import { Label, ReadMore } from '@navikt/ds-react';
import Periodevelger from '@/components/datovelger/Periodevelger';
import { ValidatorFunction } from '@/types/ValidatorFunction';
import styles from './Periodespørsmål.module.css';
import { Hjelpetekst } from '@/types/Hjelpetekst';

interface PeriodespørsmålProps {
    name: string;
    children: string;
    validate?: ValidatorFunction | ValidatorFunction[];
    minDate?: Date;
    maxDate?: Date;
    hjelpetekst?: Hjelpetekst;
    disabledFra?: boolean;
    disabledTil?: boolean;
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

export default function Periodespørsmål({
    name,
    children,
    validate,
    minDate,
    maxDate,
    hjelpetekst,
    disabledTil,
    disabledFra,
}: PeriodespørsmålProps) {
    const { control, formState, getValues } = useFormContext();
    const errorMessage = get(formState.errors, name)?.message;
    return (
        <div className={styles.periodespørsmål} id={name}>
            <Label>{children}</Label>
            {hjelpetekst && <ReadMore header={hjelpetekst.tittel}>{hjelpetekst.tekst}</ReadMore>}
            <Controller
                name={name}
                control={control}
                rules={{ validate: setupValidation(validate) }}
                render={({ field: { onChange, value } }) => {
                    const defaultFra = value?.fra ? new Date(value.fra) : undefined;
                    const defaultTil = value?.til ? new Date(value.til) : undefined;
                    return (
                        <Periodevelger
                            id={name}
                            onFromChange={(date) => {
                                onChange({
                                    fra: date || '',
                                    til: getValues(`${name}.til`),
                                });
                            }}
                            onToChange={(date) => {
                                onChange({
                                    fra: getValues(`${name}.fra`),
                                    til: date || '',
                                });
                            }}
                            defaultSelected={{
                                fra: defaultFra,
                                til: defaultTil,
                            }}
                            errorMessage={errorMessage}
                            minDate={minDate}
                            maxDate={maxDate}
                            disabledFra={disabledFra}
                            disabledTil={disabledTil}
                        />
                    );
                }}
            />
        </div>
    );
}
