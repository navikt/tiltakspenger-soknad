import React, { ReactElement } from 'react';
import { BodyLong, Button, GuidePanel, Heading } from '@navikt/ds-react';
import BannerLayout from '@/components/banner-layout/BannerLayout';
import styles from './FeilVedInnsending.module.css';

export default function FeilVedInnsending() {
    return (
        <div className={styles.feilVedInnsending}>
            <Heading size="medium" level="2" className={styles.feilVedInnsendingHeading}>
                Oisann, her gikk det galt!
            </Heading>
            <GuidePanel poster className={styles.feilVedInnsendingGuidePanel}>
                <BodyLong>
                    Det har dessverre skjedd en feil hos oss ved innsending av tiltakspengesøknaden. Vi jobber med
                    saken. Du må fylle ut søknaden på nytt og sende inn, eller logge ut og prøve igjen senere.
                </BodyLong>
            </GuidePanel>
            <div className={styles.lastInnSidenPåNyttButton}>
                <Button type="button" onClick={() => ((window.location as any) = '/')}>
                    Start søknaden på nytt
                </Button>
            </div>
        </div>
    );
}

FeilVedInnsending.getLayout = function getLayout(page: ReactElement) {
    return <BannerLayout>{page}</BannerLayout>;
};
