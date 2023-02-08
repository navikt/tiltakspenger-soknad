import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@navikt/ds-react';

interface OppsummeringsstegProps {
    onCompleted: (data: any) => void;
}

export default function Oppsummeringssteg({ onCompleted }: OppsummeringsstegProps) {
    const { getValues } = useFormContext();
    const data = getValues();
    return (
        <div>
            <h2>Oppsummering</h2>
            <p>{JSON.stringify(data)}</p>
            <Button type="button" onClick={onCompleted}>
                Send inn søknad
            </Button>
        </div>
    );
}
