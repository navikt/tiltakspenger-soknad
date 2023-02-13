import React from 'react';
import { Button } from '@navikt/ds-react';
import { useFormContext } from 'react-hook-form';
import styles from './Steg.module.css';

interface StegProps {
    tittel: string;
    onCompleted: () => void;
    onGoToPreviousStep: () => void;
    children: React.ReactNode;
}

export default function Steg({ tittel, children, onCompleted, onGoToPreviousStep }: StegProps) {
    const { handleSubmit } = useFormContext();
    return (
        <>
            <h2>{tittel}</h2>
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
        </>
    );
}
