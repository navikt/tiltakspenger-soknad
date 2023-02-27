import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Periodevelger from '@/components/datovelger/Periodevelger';
import styles from './Periodespørsmål.module.css';

interface PeriodespørsmålProps {
    name: string;
    children: string;
}

export default function Periodespørsmål({ name, children }: PeriodespørsmålProps) {
    const { control } = useFormContext();
    return (
        <fieldset className={styles.periodespørsmål}>
            <legend className={styles.periodespørsmål__legend}>{children}</legend>
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
