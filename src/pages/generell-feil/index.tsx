import React, { ReactElement } from 'react';
import { BodyLong, Button, GuidePanel, Heading } from '@navikt/ds-react';
import BannerLayout from '@/components/banner-layout/BannerLayout';
import styles from './GenerellFeil.module.css';

export default function GenerellFeil() {
    return (
        <div className={styles.generellFeil}>
            <Heading size="medium" level="2" className={styles.generellFeilHeading}>
                Oisann, her gikk det galt!
            </Heading>
            <GuidePanel poster className={styles.generellFeilGuidePanel}>
                <BodyLong>
                    Det har dessverre skjedd en feil hos oss som gjør at du ikke får fylt ut søknaden om tiltakspenger
                    akkurat nå. Vi jobber med saken. Du kan prøve å laste inn siden på nytt, eller logge ut og prøve
                    igjen senere.
                </BodyLong>
            </GuidePanel>
            <div className={styles.lastInnSidenPåNyttButton}>
                <Button type="button" onClick={() => ((window.location as any) = '/')}>
                    Last inn siden på nytt
                </Button>
            </div>
        </div>
    );
}

GenerellFeil.getLayout = function getLayout(page: ReactElement) {
    return <BannerLayout>{page}</BannerLayout>;
};
