import React, { useContext } from 'react';
import { GuidePanel, Heading, Link } from '@navikt/ds-react';
import { UtfyllingContext } from '@/pages/utfylling/[[...step]]';
import styles from './IkkeMyndig.module.css';

export default function IkkeMyndig() {
    const { personalia } = useContext(UtfyllingContext);
    return (
        <>
            <Heading size="large" className={styles.ikkeMyndigHeading}>
                Søknad om tiltakspenger
            </Heading>
            <GuidePanel poster className={styles.ikkeMyndigGuidePanel}>
                <p>
                    Hei,{' '}
                    {`${personalia?.fornavn} ${personalia?.mellomnavn ? `${personalia?.mellomnavn} ` : ''}${
                        personalia?.etternavn
                    }`}
                </p>
                <p>
                    For å ha rett til tiltakspenger må du være fylt 18 år. Du må også være fylt 18 år for å levere
                    digital søknad om tiltakspenger.
                </p>
                <p>
                    Om du ønsker å søke tiltakspenger før du fylt 18 år, må du få underskrift av en foresatt eller verge
                    og sende søknad med vanlig post. Du finner papirsøknaden som du kan skrive ut ved å trykke på
                    knappen under merket "Send søknad med post".
                </p>
            </GuidePanel>
            <div className={styles.sendSøknadMedPostLink}>
                <Link href="https://www.nav.no/soknader/nb/person/arbeid/tiltakspenger">Send søknad med post</Link>
            </div>
        </>
    );
}
