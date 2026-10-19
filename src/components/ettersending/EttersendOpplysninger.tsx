import React from 'react';
import { BodyLong, Link } from '@navikt/ds-react';
import { ETTERSENDING_URL } from '@/utils/lenker';

/** Lenker til ettersending, for bruker som vil sende flere opplysninger eller dokumentasjon til en søknad vi allerede har mottatt. */
export default function EttersendOpplysninger() {
    return (
        <BodyLong spacing>
            Vil du bare sende oss dokumentasjon eller flere opplysninger til søknaden, kan du{' '}
            <Link href={ETTERSENDING_URL} target="_blank">
                ettersende dem (åpnes i ny fane)
            </Link>
            .
        </BodyLong>
    );
}
