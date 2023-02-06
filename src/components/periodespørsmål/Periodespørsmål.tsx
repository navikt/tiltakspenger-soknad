import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Periodevelger from '@/components/datovelger/Periodevelger';

interface PeriodespørsmålProps {
    name: string;
    children: string;
}

export default function Periodespørsmål({ name, children }: PeriodespørsmålProps) {
    const { control } = useFormContext();
    return (
        <fieldset style={{ marginTop: '1rem' }}>
            <legend>{children}</legend>
            <Controller
                name={name}
                control={control}
                defaultValue={{ fra: '', til: '' }}
                render={({ field: { onChange } }) => (
                    <Periodevelger
                        onRangeChange={(periode) => {
                            if (periode) {
                                const { from: fra, to: til } = periode;
                                onChange({ fra, til });
                            }
                        }}
                    />
                )}
            />
        </fieldset>
    );
}
