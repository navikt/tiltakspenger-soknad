import React, { useContext } from 'react';
import { BodyLong, Heading, Link } from '@navikt/ds-react';
import { UtfyllingContext } from '@/pages/utfylling/[[...step]]';
import CustomGuidePanel from '@/components/custom-guide-panel/CustomGuidePanel';
import styles from './IkkeMyndig.module.css';

export default function IkkeMyndig() {
    const { personalia } = useContext(UtfyllingContext);
    return (
        <>
            <Heading size="large" className={styles.ikkeMyndigHeading}>
                Søknad om tiltakspenger
            </Heading>
            <CustomGuidePanel poster className={styles.ikkeMyndigGuidePanel}>
                <BodyLong spacing>
                    Hei,{' '}
                    {`${personalia?.fornavn} ${personalia?.mellomnavn ? `${personalia?.mellomnavn} ` : ''}${
                        personalia?.etternavn
                    }`}
                </BodyLong>
                <BodyLong spacing>
                    For å ha rett til tiltakspenger må du være fylt 18 år. Du må også være fylt 18 år for å levere
                    digital søknad om tiltakspenger.
                </BodyLong>
                <BodyLong spacing>
                    Hvis du ønsker å søke tiltakspenger før du fyller 18 år, må du få underskrift av en foresatt eller
                    verge og sende søknad med vanlig post.
                </BodyLong>
                <BodyLong>
                    Hvis du skal sende søknaden i posten kan du følge lenken "Send søknad med post". Her vil du få
                    instruksjoner for hvordan du skal gå fram.
                </BodyLong>
            </CustomGuidePanel>
            <div className={styles.sendSøknadMedPostLink}>
                <Link href="https://www.nav.no/fyllut/nav761345?sub=paper">Send søknad med post</Link>
            </div>
        </>
    );
}
