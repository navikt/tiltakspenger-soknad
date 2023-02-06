import React, { MouseEvent } from 'react';
import { Button } from '@navikt/ds-react';
import { useRouter } from 'next/router';

export default function App() {
    const router = useRouter();

    const startSøknad = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        router.push('/utfylling');
    };

    return (
        <Button onClick={startSøknad} type="button">
            Start søknad om tiltakspenger
        </Button>
    );
}
