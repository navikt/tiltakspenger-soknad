import React, { ReactElement } from 'react';
import { BodyLong, Button, Heading } from '@navikt/ds-react';
import BannerLayout from '@/components/banner-layout/BannerLayout';
import CustomGuidePanel from '@/components/custom-guide-panel/CustomGuidePanel';
import styles from './GenerellFeil.module.css';
import { pageWithAuthentication } from '@/utils/authentication';

export default function GenerellFeil() {
    return (
        <div className={styles.generellFeil}>
            <Heading size="medium" level="2" className={styles.generellFeilHeading}>
                Oisann, her gikk det galt!
            </Heading>
            <CustomGuidePanel poster className={styles.generellFeilGuidePanel}>
                <BodyLong>
                    Det har dessverre skjedd en feil hos oss som gjør at du ikke får fylt ut søknaden om tiltakspenger
                    akkurat nå. Vi jobber med saken. Du kan prøve å laste inn siden på nytt, eller logge ut og prøve
                    igjen senere.
                </BodyLong>
            </CustomGuidePanel>
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

export const getServerSideProps = pageWithAuthentication();
