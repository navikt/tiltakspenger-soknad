import React from 'react';
import { Button } from '@navikt/ds-react';
import { useFormContext } from 'react-hook-form';
import styles from './Steg.module.css';

interface StegProps {
    tittel: string;
    onCompleted: () => void;
    onGoToPreviousStep: () => void;
    children: React.ReactNode;
    stepNumber: number;
    submitSectionRenderer?: () => React.ReactNode;
}

export default function Steg({
    tittel,
    children,
    onCompleted,
    onGoToPreviousStep,
    stepNumber,
    submitSectionRenderer,
}: StegProps) {
    const { handleSubmit } = useFormContext();
    const shouldRenderCustomSubmitSection = !!submitSectionRenderer;
    return (
        <>
            <h2 style={{ textAlign: 'center' }}>{tittel}</h2>
            <span style={{ fontWeight: 'bold' }}>Steg {stepNumber} av 5</span>
            {shouldRenderCustomSubmitSection && (
                <>
                    {children}
                    {submitSectionRenderer()}
                </>
            )}
            {!shouldRenderCustomSubmitSection && (
                <form onSubmit={handleSubmit(onCompleted)}>
                    <>
                        {children}
                        <div className={styles.steg__knappeseksjon}>
                            <Button type="button" size="small" variant="secondary" onClick={onGoToPreviousStep}>
                                Forrige steg
                            </Button>
                            <Button type="submit" size="small">
                                Neste steg
                            </Button>
                        </div>
                    </>
                </form>
            )}
        </>
    );
}
