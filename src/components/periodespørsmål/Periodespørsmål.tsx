import React from 'react';
import { Controller, get, useFormContext } from 'react-hook-form';
import dayjs from 'dayjs';
import { ReadMore } from '@navikt/ds-react';
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
    ikkeVisTilDato?: boolean;
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

export default function  Periodespørsmål({
    name,
    children,
    validate,
    minDate,
    maxDate,
    hjelpetekst,
    ikkeVisTilDato,
}: PeriodespørsmålProps) {
    const { control, watch, formState } = useFormContext();
    const verdi = watch(name);
    const defaultValue = verdi ? { from: dayjs(verdi.fra).toDate(), to: dayjs(verdi.til).toDate() } : null;
    const errorMessage = get(formState.errors, name)?.message;
    return (
        <fieldset className={styles.periodespørsmål}>
            <legend className={styles.periodespørsmål__legend}>{children}</legend>
            {hjelpetekst && <ReadMore header={hjelpetekst.tittel}>{hjelpetekst.tekst}</ReadMore>}
            <Controller
                name={name}
                control={control}
                rules={{ validate: setupValidation(validate) }}
                render={({ field: { onChange } }) => (
                    <Periodevelger
                        id={name}
                        defaultValue={defaultValue}
                        onRangeChange={(periode) => {
                            if (periode) {
                                const { from: fra, to: til } = periode;
                                onChange({ fra, til });
                            }
                        }}
                        errorMessage={errorMessage}
                        minDate={minDate}
                        maxDate={maxDate}
                        ikkeVisTilDato={ikkeVisTilDato}
                    />
                )}
            />
        </fieldset>
    );
}
