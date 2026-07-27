import React from 'react';
import { Controller, get, useFormContext } from 'react-hook-form';
import { Label, ReadMore } from '@navikt/ds-react';
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
    /** Korter ned kalenderen og år-nedtrekket uten å stramme inn hva som godtas — se [Datovelger]. */
    kalenderFraDato?: Date;
    defaultMonth?: Date;
    description?: string;
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

// Feltet er typet som string (`Barn.fødselsdato`), men datovelgeren skriver en Date tilbake.
// Verdien kan derfor være tom streng, en Date eller en datostreng.
// Datovelgeren tar bare imot en Date eller ingenting, så alt som ikke lar seg tolke blir undefined.
function somDato(verdi: unknown): Date | undefined {
    if (verdi instanceof Date) {
        return verdi;
    }
    if (typeof verdi === 'string' && verdi !== '') {
        const dato = new Date(verdi);
        return isNaN(dato.getTime()) ? undefined : dato;
    }
    return undefined;
}

export default function Datospørsmål({
    name,
    children,
    validate,
    minDate,
    maxDate,
    kalenderFraDato,
    defaultMonth,
    description,
    hjelpetekst,
    datoMåVæreIFortid,
    legend,
}: DatospørsmålProps) {
    const { control, formState } = useFormContext();
    const errorMessage = get(formState.errors, name)?.message;
    return (
        <div className={styles.datospørsmål}>
            {legend && <Label>{legend}</Label>}
            {hjelpetekst && <ReadMore header={hjelpetekst.tittel}>{hjelpetekst.tekst}</ReadMore>}
            <Controller
                name={name}
                control={control}
                rules={{ validate: setupValidation(validate) }}
                render={({ field: { onChange, value } }) => (
                    <Datovelger
                        id={name}
                        label={children}
                        description={description}
                        onDateChange={onChange}
                        errorMessage={errorMessage}
                        minDate={minDate}
                        maxDate={maxDate}
                        kalenderFraDato={kalenderFraDato}
                        defaultMonth={defaultMonth}
                        datoMåVæreIFortid={datoMåVæreIFortid}
                        defaultSelected={somDato(value)}
                    />
                )}
            />
        </div>
    );
}
