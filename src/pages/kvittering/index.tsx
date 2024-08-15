import React, {useContext} from 'react';
import { Alert, Button, Link } from '@navikt/ds-react';
import styles from './kvittering.module.css';
import { CheckmarkCircleFillIcon } from '@navikt/aksel-icons';
import Show from '@/components/show/show';
import { dateStrWithHourMinute, dateStrWithMonthName } from '@/utils/formatDate';
import { useFormContext } from 'react-hook-form';
import Søknad from '@/types/Søknad';
import { useRouter } from 'next/router';
import defaultValues from '@/defaultValues';
import {InnsendingContext} from "@/pages/_app";
import {UtfyllingContext} from "@/pages/utfylling/[[...step]]";

export default function Kvittering() {
    const { personalia} = useContext(UtfyllingContext);
    const { innsendingstidspunkt } = useContext(InnsendingContext);
    const router = useRouter();
    const { getValues, reset } = useFormContext<Søknad>();
    const manueltRegistrerteBarn = getValues('svar.barnetillegg.manueltRegistrerteBarnSøktBarnetilleggFor');
    const vedlegg = getValues('vedlegg');
    const manueltRegistrerteBarnUtenVedlegg = (manueltRegistrerteBarn || []).filter((barn) => {
        const vedleggListe = vedlegg || [];
        const ikkeFunnet = !vedleggListe.find((vedlegg) => barn?.uuid === vedlegg?.uuid);
        return ikkeFunnet;
    });
    const formatertInnsendingsTidspunkt = `${dateStrWithMonthName(
        innsendingstidspunkt,
    )}, klokken ${dateStrWithHourMinute(innsendingstidspunkt)}`;

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
        <div className={styles.container}>
            <div className={styles.body}>
                <p>
                    {' '}
                    <CheckmarkCircleFillIcon title="sendt-søknad-bekreftelse-icon" className={styles.checkmark} />{' '}
                </p>

                <h4 className={styles.centerText}>
                    Takk for søknaden, {personalia?.fornavn} {personalia?.etternavn}!
                </h4>

                <h6 className={styles.centerText}>Søknaden ble sendt til NAV {formatertInnsendingsTidspunkt}.</h6>

                <Alert variant="success">
                    <span>
                        Vi har mottatt søknaden din om tiltakspenger. <br />
                        Saken din er nå til behandling hos NAV.
                    </span>

                    <p>Vi vil ta kontakt med deg hvis vi trenger mer informasjon eller dokumentasjon fra deg.</p>
                </Alert>

                <Show if={(manueltRegistrerteBarnUtenVedlegg || []).length > 0}>
                    <Alert variant="warning" style={{ marginTop: '2rem' }}>
                        <span>
                            <span>Vi mangler dokumentasjon fra deg for å kunne behandle søknaden. </span>
                            <p>Saken din er nå til behandling hos NAV.</p>
                            <p>
                                <Link href="https://www.nav.no/ettersende#tiltakspenger" target="_blank">
                                    Her kan du ettersende dokumentasjon digitalt (åpnes i nytt vindu)
                                </Link>
                            </p>
                            <p>
                                Du kan også{' '}
                                <Link
                                    href="https://www.nav.no/soknader/nb/person/arbeid/tiltakspenger/NAV%2076-13.45/ettersendelse/brev"
                                    target="_blank"
                                >
                                    ettersende per post (åpnes i nytt vindu)
                                </Link>{' '}
                                eller levere
                            </p>
                            <p>dokumentasjon på ditt lokale NAV-kontor.</p>
                        </span>
                    </Alert>
                </Show>

                <p>
                    <Link href="https://www.nav.no/saksbehandlingstider#tiltakspenger" target="_blank">
                        Du kan se forventet saksbehandlingstid på nav.no/saksbehandlingstider (åpnes i ny fane).
                    </Link>
                </p>

                <Link href="https://www.nav.no/minside" className={styles.button}>
                    <Button as="a">Følg saken på Min side</Button>
                </Link>
            </div>
        </div>
    );
}
