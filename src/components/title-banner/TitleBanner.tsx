import React from 'react';
import { Heading } from '@navikt/ds-react';
import styles from './TitleBanner.module.css';

export default function TitleBanner() {
    return (
        <div className={styles.titleBanner}>
            <Heading size="large" level="1" className={styles.title}>
                Søknad om tiltakspenger
            </Heading>
        </div>
    );
}
