import React from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { Button, TextField } from '@navikt/ds-react';
import { Add, Close } from '@navikt/ds-icons';
import Datovelger from '@/components/datovelger/Datovelger';
import { SelvregistrertBarn } from '@/types/Barn';

interface VariabelPersonlisteProps {
    name: string;
    initialList?: SelvregistrertBarn[];
}

/**
 * Rendrer personskjemaer, wrappet i et field array koblet til skjemaet,
 * inkluderer fjern- og legg-til-knapp.
 */
export default function VariabelPersonliste({ name }: VariabelPersonlisteProps) {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: name,
    });
    return (
        <>
            <Button
                type={'button'}
                icon={<Add aria-hidden />}
                iconPosition="left"
                size={'small'}
                onClick={() => append({})}
            >
                Legg til barn
            </Button>
            {fields.map((item, index) => (
                <fieldset style={{ marginTop: '1rem' }} key={item.id}>
                    <legend>{`Barn ${index + 1}`}</legend>
                    <Controller
                        name={`${name}.${index}`}
                        control={control}
                        defaultValue={{
                            fornavn: '',
                            etternavn: '',
                            fdato: '',
                            bodstedsland: '',
                        }}
                        render={({ field }) => (
                            <>
                                <TextField
                                    label="Barnets fornavn"
                                    value={field.value.fornavn || ''}
                                    onChange={(event) =>
                                        field.onChange({
                                            ...field.value,
                                            fornavn: event.target.value,
                                        })
                                    }
                                />
                                <TextField
                                    label="Barnets etternavn"
                                    value={field.value.etternavn || ''}
                                    onChange={(event) =>
                                        field.onChange({
                                            ...field.value,
                                            etternavn: event.target.value,
                                        })
                                    }
                                />
                                <Datovelger
                                    onDateChange={(dato) =>
                                        field.onChange({
                                            ...field.value,
                                            fødselsdato: dato?.toISOString().split('T')[0] ?? '',
                                        })
                                    }
                                    label="Fødselsdato"
                                />
                                <TextField
                                    label="Bostedsland"
                                    value={field.value.bostedsland || ''}
                                    onChange={(event) =>
                                        field.onChange({
                                            ...field.value,
                                            bostedsland: event.target.value,
                                        })
                                    }
                                />
                            </>
                        )}
                    />
                    {fields.length > 1 && (
                        <Button
                            icon={<Close aria-hidden />}
                            iconPosition="left"
                            variant={'danger'}
                            size={'small'}
                            onClick={() => remove(index)}
                        >
                            Fjern barn
                        </Button>
                    )}
                </fieldset>
            ))}
        </>
    );
}
