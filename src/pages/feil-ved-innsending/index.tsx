import React, {ReactElement, useContext} from 'react';
import { BodyLong, Button, Heading } from '@navikt/ds-react';
import BannerLayout from '@/components/banner-layout/BannerLayout';
import CustomGuidePanel from '@/components/custom-guide-panel/CustomGuidePanel';
import styles from './FeilVedInnsending.module.css';
import { pageWithAuthentication } from '@/utils/pageWithAuthentication';
import defaultValues from '@/defaultValues';
import { useRouter } from 'next/router';
import { useFormContext } from 'react-hook-form';
import Søknad from '@/types/Søknad';
import {UtfyllingContext} from "@/pages/utfylling/[[...step]]";
import {InnsendingContext} from "@/pages/_app";
import {sendInnSøknad} from "@/utils/innsending";

export default function FeilVedInnsending() {
    const router = useRouter();
    const { reset, getValues } = useFormContext<Søknad>();
    const { personalia, valgtTiltak } = useContext(UtfyllingContext);
    const { setSøknadsinnsendingInProgress, setInnsendingstidspunkt, søknadsinnsendingInProgress } = useContext(InnsendingContext);

    function navigateToHome() {
        return router.push('/', undefined, { shallow: false });
    }

    React.useEffect(() => {
        router.beforePopState(({ as }) => {
            if (as !== router.asPath) {
                reset(defaultValues);
                router.push(process.env.NEXT_PUBLIC_BASE_PATH ?? '/', '', { shallow: false });
                return false;
            }
            return true;
        });

        return () => {
            router.beforePopState(() => true);
        };
    }, [router]);

    return (
        <div className={styles.feilVedInnsending}>
            <Heading size="medium" level="2" className={styles.feilVedInnsendingHeading}>
                Oisann, her gikk det galt!
            </Heading>
            <CustomGuidePanel poster className={styles.feilVedInnsendingGuidePanel}>
                <BodyLong>
                    Det har dessverre skjedd en feil hos oss ved innsending av tiltakspengesøknaden. Vi jobber med
                    saken. Du må fylle ut søknaden på nytt og sende inn, eller logge ut og prøve igjen senere.
                </BodyLong>
            </CustomGuidePanel>
            <div className={styles.lastInnSidenPåNyttButton}>
                <Button
                    type="button"
                    onClick={ () => sendInnSøknad(router, getValues(), personalia!, valgtTiltak!, setSøknadsinnsendingInProgress!, setInnsendingstidspunkt!) }
                    disabled={søknadsinnsendingInProgress}
                    loading={søknadsinnsendingInProgress}
                >
                    Send inn på nytt
                </Button>
            </div>
            <div className={styles.lastInnSidenPåNyttButton}>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={navigateToHome}
                >
                    Start søknaden på nytt
                </Button>
            </div>
        </div>
    );
}

FeilVedInnsending.getLayout = function getLayout(page: ReactElement) {
    return <BannerLayout>{page}</BannerLayout>;
};

export const getServerSideProps = pageWithAuthentication();
