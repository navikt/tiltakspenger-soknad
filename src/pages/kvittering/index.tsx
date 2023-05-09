import React, { useState } from 'react';
import { Alert, Button, Link } from '@navikt/ds-react';
import styles from './kvittering.module.css';
import { CheckmarkCircleFillIcon, DownloadIcon } from '@navikt/aksel-icons';
import Show from '@/components/show/show';
import { Personalia } from '@/types/Personalia';
import SøknadResponse from "@/types/SøknadResponse";

interface KvitteringProps {
    personalia: Personalia;
    søknadResponse: SøknadResponse;
}

export default function Kvittering(props: KvitteringProps)
{
    const [visManglendeDokVarsel, setvisManglendeDokVarsel] = useState(false);

    return (
        <div>
            <p>
                <CheckmarkCircleFillIcon title="sendt-søknad-bekreftelse" className={styles.checkmark} />
            </p>

            <h4 className={styles.bekreftkvittering}>
                Takk for søknadenen, {props.personalia.fornavn} {props.personalia.etternavn}!
            </h4>

            <p>
                <h6>Søknaden ble sendt til NAV {props.søknadResponse.innsendingTidspunkt}.</h6>
            </p>

            <Alert variant="success">
                <span>
                    Vi har mottatt søknaden din om Tiltakspenger. <br />
                    Saken din er nå til behandling hos NAV.
                </span>

                <p>Vi vil kontakt med deg hvis vi trenger mer informasjon eller dokumentasjon fra deg.</p>
            </Alert>

            <Show if={visManglendeDokVarsel}>
                <Alert variant="warning" style={{ marginTop: '2rem' }}>
                    <span>
                        <span>Vi mangler dokumentasjon fra deg for å kunne behandle søknaden. </span>
                        <p>Saken din er nå til behandling hos NAV.</p>
                        <p>
                            <Link href="#">Her kan du ettersende dokumentasjon digitalt (åpnes i nytt vindu)</Link>
                        </p>
                        <p>
                            Du kan også <Link href="#">ettersende per post (åpnes i nytt vindu)</Link> eller levere
                        </p>
                        <p>dokumntasjon på ditt lokale NAV-kontor.</p>
                    </span>
                </Alert>
            </Show>

            <p>
                <Link href="https://www.nav.no/saksbehandlingstider" target="_blank">
                    Du kan se forventet saksbehandlingstid på nav.no/saksbehandlingstider.
                </Link>
            </p>

            <Link href="https://www.nav.no/minside" target="_blank" className={styles.button}>
                <Button as="a">Følg saken på Min Side</Button>
            </Link>
        </div>
    );
}
