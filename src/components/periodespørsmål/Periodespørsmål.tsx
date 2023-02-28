import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import dayjs from 'dayjs';
import Periodevelger from '@/components/datovelger/Periodevelger';
import styles from './Periodespørsmål.module.css';

interface PeriodespørsmålProps {
    name: string;
    children: string;
}

export default function Periodespørsmål({ name, children }: PeriodespørsmålProps) {
    const { control, watch } = useFormContext();
    const verdi = watch(name);
    const defaultValue = verdi ? { from: dayjs(verdi.fra).toDate(), to: dayjs(verdi.til).toDate() } : null;
    return (
        <fieldset className={styles.periodespørsmål}>
            <legend className={styles.periodespørsmål__legend}>{children}</legend>
            <Controller
                name={name}
                control={control}
                render={({ field: { onChange } }) => (
                    <Periodevelger
                        defaultValue={defaultValue}
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
