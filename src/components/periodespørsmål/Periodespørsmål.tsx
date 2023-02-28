import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import dayjs from 'dayjs';
import Periodevelger from '@/components/datovelger/Periodevelger';
import styles from './Periodespørsmål.module.css';
type ValidatorFunction = (value: any) => string | undefined;

interface PeriodespørsmålProps {
    name: string;
    children: string;
    validate?: ValidatorFunction | ValidatorFunction[];
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

export default function Periodespørsmål({ name, children, validate }: PeriodespørsmålProps) {
    const { control, watch, formState } = useFormContext();
    const verdi = watch(name);
    const defaultValue = verdi ? { from: dayjs(verdi.fra).toDate(), to: dayjs(verdi.til).toDate() } : null;

    const errorMessage = formState.errors[name]?.message as string;
    return (
        <fieldset className={styles.periodespørsmål}>
            <legend className={styles.periodespørsmål__legend}>{children}</legend>
            <Controller
                name={name}
                control={control}
                rules={{ validate: setupValidation(validate) }}
                render={({ field: { onChange } }) => (
                    <Periodevelger
                        defaultValue={defaultValue}
                        onRangeChange={(periode) => {
                            if (periode) {
                                const { from: fra, to: til } = periode;
                                onChange({ fra, til });
                            }
                        }}
                        errorMessage={errorMessage}
                    />
                )}
            />
        </fieldset>
    );
}
