import React from 'react';
import { Controller, get, useFormContext } from 'react-hook-form';
import {Label, ReadMore} from '@navikt/ds-react';
import Datovelger from '@/components/datovelger/Datovelger';
import { ValidatorFunction } from '@/types/ValidatorFunction';
import styles from './Datospørsmål.module.css';
import { Hjelpetekst } from '@/types/Hjelpetekst';

interface DatospørsmålProps {
    name: string;
    children: string;
    validate?: ValidatorFunction | ValidatorFunction[];
    minDate?: Date;
    maxDate?: Date;
    hjelpetekst?: Hjelpetekst;
    datoMåVæreIFortid?: boolean;
    legend?: string;
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

export default function Datospørsmål({
    name,
    children,
    validate,
    minDate,
    maxDate,
    hjelpetekst,
    datoMåVæreIFortid,
    legend,
}: DatospørsmålProps) {
    const { control, formState } = useFormContext();
    const errorMessage = get(formState.errors, name)?.message;
    return (
        <div className={styles.datospørsmål}>
            <Label>{legend}</Label>
            {hjelpetekst && <ReadMore header={hjelpetekst.tittel}>{hjelpetekst.tekst}</ReadMore>}
            <Controller
                name={name}
                control={control}
                rules={{ validate: setupValidation(validate) }}
                render={({ field: { onChange, value } }) => (
                    <Datovelger
                        id={name}
                        label={children}
                        onDateChange={onChange}
                        errorMessage={errorMessage}
                        minDate={minDate}
                        maxDate={maxDate}
                        datoMåVæreIFortid={datoMåVæreIFortid}
                        defaultSelected={value != '' ? value : null}
                    />
                )}
            />
        </div>
    );
}
