import React from 'react';
import { Controller, get, useFormContext } from 'react-hook-form';
import { ConfirmationPanel } from '@navikt/ds-react';

interface BekreftelsesspørsmålProps {
    label: string;
    children: string | React.ReactNode;
    name: string;
    validate?: (value: any) => string | undefined;
    className?: string;
}

export default function Bekreftelsesspørsmål({
    children,
    label,
    name,
    validate,
    className,
}: BekreftelsesspørsmålProps) {
    const { control, formState } = useFormContext();
    const errorMessage = get(formState.errors, name)?.message;
    const errorObject = errorMessage ? { error: <>{errorMessage}</> } : {};
    return (
        <Controller
            name={name}
            control={control}
            rules={{ validate }}
            render={({ field: { value, name, onBlur, onChange } }) => (
                <ConfirmationPanel
                    className={className}
                    id={name}
                    label={label}
                    name={name}
                    onBlur={onBlur}
                    checked={value}
                    value={value}
                    onChange={() => onChange(!value)}
                    {...errorObject}
                >
                    {children}
                </ConfirmationPanel>
            )}
        />
    );
}
