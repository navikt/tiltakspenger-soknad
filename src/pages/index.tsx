import React, { ReactElement, useContext, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { Button, Link, Heading } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import Accordion from '@/components/accordion/Accordion';
import Bekreftelsesspørsmål from '@/components/bekreftelsesspørsmål/Bekreftelsesspørsmål';
import Søknad from '@/types/Søknad';
import { påkrevdBekreftelsesspørsmål } from '@/utils/formValidators';
import { Personalia } from '@/types/Personalia';
import { UtfyllingSetStateContext } from '@/pages/_app';
import { GetServerSidePropsContext } from 'next';
import logger from '@/utils/serverLogger';
import { getOnBehalfOfToken } from '@/utils/authentication';
import { makeGetRequest } from '@/utils/http';
import styles from './index.module.css';
import SøknadLayout from '@/components/søknad-layout/SøknadLayout';
import IkkeMyndig from '@/components/ikke-myndig/IkkeMyndig';
import CustomGuidePanel from '@/components/custom-guide-panel/CustomGuidePanel';

function harBekreftetÅSvareSåGodtManKanValidator(verdi: boolean) {
    return påkrevdBekreftelsesspørsmål(
        verdi,
        'Du må bekrefte at du vil svare så godt du kan på spørsmålene som blir stilt i søknaden'
    );
}

interface IndexPageProps {
    personalia: Personalia;
}

export default function IndexPage({ personalia }: IndexPageProps) {
    const router = useRouter();
    const { handleSubmit } = useFormContext<Søknad>();

    const utyllingSetStateContext = useContext(UtfyllingSetStateContext);

    useEffect(() => {
        utyllingSetStateContext.setPersonalia!(personalia);
    }, []);

    const startSøknad = () => {
        router.push('/utfylling/tiltak');
    };

    if (!personalia.harFylt18År) {
        return <IkkeMyndig />;
    }

    return (
        <form onSubmit={handleSubmit(startSøknad)}>
            <Heading className={styles.søknadstittel} size="large" level="1">
                Søknad om tiltakspenger
            </Heading>
            <CustomGuidePanel poster>
                <p>Hei! Jeg er her for å veilede deg gjennom søknaden.</p>
                <p>Du kan ha rett til tiltakspenger hvis du deltar i et arbeidsmarkedstiltak som NAV har godkjent.</p>
                <p>
                    OBS: Hvis du tar pause på mer enn X minutter, slettes skjemaet på grunn av sikkerhetsinnstillinger.
                </p>
            </CustomGuidePanel>
            <div className={styles.accordions}>
                <Accordion header="Tiltakspenger og annen inntekt">
                    <span>Du kan ikke få tiltakspenger hvis du</span>
                    <ul>
                        <li>får annen pengestøtte som helt eller delvis skal dekke dine daglige utgifter</li>
                        <li>får lønn samtidig som du deltar i tiltaket</li>
                    </ul>
                    <span>Det har ikke betydning hvor mye du får i annen pengestøtte eller lønn.</span>
                </Accordion>
                <Accordion header="Hvis du får tiltakspenger, gjelder dette">
                    <ul>
                        <li>Du må møte som avtalt i tiltaket</li>
                        <li>Du må sende inn meldekortet ditt hver 14. dag</li>
                        <li>Du må gi beskjed hvis situasjonen din endrer seg</li>
                        <li>Du må betale tilbake hvis du får tiltakspenger du ikke har rett på</li>
                    </ul>
                </Accordion>
                <Accordion header="Vi henter og bruker informasjon om deg">
                    <p>I tillegg til den informasjonen du oppgir i søknaden, henter vi:</p>
                    <ul>
                        <li>Personinformasjon om deg fra Folkeregisteret.</li>
                        <li>Personinformasjon om barna dine hvis du søker om barnetillegg</li>
                        <li>Inntektsinformasjon fra Skatteetaten</li>
                        <li>Opplysninger om hvilket arbeidsmarkedstiltak du deltar på</li>
                        <li>Opplysninger om du får andre utbetalinger fra NAV</li>
                        <li>Hvis du har barn, sjekker vi om barnets andre forelder har barnetillegg</li>
                    </ul>
                    <p>Dette gjør vi for å vurdere om du har rett til tiltakspenger.</p>
                    <p>
                        Vi deler opplysninger om hva du får utbetalt i tiltakspenger med Skatteetaten og Statistisk
                        sentralbyrå. Vi kan bruke opplysninger om deg til å forbedre våre tjenester.
                    </p>
                    <Link
                        href="https://www.nav.no/no/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten"
                        target="_blank"
                    >
                        Du kan lese mer om hvordan NAV behandler personopplysninger på nav.no (åpnes i ny fane).
                    </Link>
                </Accordion>
            </div>
            <Bekreftelsesspørsmål
                className={styles.bekreftelsespanel}
                label="Jeg vil svare så godt jeg kan på spørsmålene i søknaden"
                name="svar.harBekreftetÅSvareSåGodtManKan"
                validate={harBekreftetÅSvareSåGodtManKanValidator}
            >
                <b>Vi stoler på deg</b>
            </Bekreftelsesspørsmål>
            <div className={styles.knappeseksjon}>
                <Button type="submit" size="small">
                    Start søknaden
                </Button>
            </div>
        </form>
    );
}

IndexPage.getLayout = function getLayout(page: ReactElement) {
    return <SøknadLayout>{page}</SøknadLayout>;
};

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
    let token = null;
    try {
        logger.info('Henter token');
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            throw new Error('Mangler token');
        }
        token = await getOnBehalfOfToken(authorizationHeader);
    } catch (error) {
        logger.error('Bruker har ikke tilgang', error);
        return {
            redirect: {
                destination: '/oauth2/login',
                permanent: false,
            },
        };
    }

    const backendUrl = process.env.TILTAKSPENGER_SOKNAD_API_URL;
    try {
        logger.info('Hent personalia start');
        const personaliaResponse = await makeGetRequest(`${backendUrl}/personalia`, token);
        const personaliaJson = await personaliaResponse.json();
        logger.info('Hent personalia-kall OK');
        return {
            props: {
                personalia: {
                    ...personaliaJson,
                    barn: personaliaJson.barn.map((barn: any) => ({
                        ...barn,
                        uuid: uuidv4(),
                    })),
                },
            },
        };
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            logger.error((error as Error).message);
            return {
                props: {
                    personalia: {
                        fornavn: 'Foo',
                        mellomnavn: 'Bar',
                        etternavn: 'Baz',
                        fødselsnummer: '123',
                        harFylt18År: true,
                        barn: [
                            { fornavn: 'Test', etternavn: 'Testesen', fødselsdato: '2025-01-01', uuid: uuidv4() },
                            { fornavn: 'Fest', etternavn: 'Festesen', fødselsdato: '2020-12-31', uuid: uuidv4() },
                        ],
                    },
                },
            };
        }

        logger.error(
            'Noe gikk galt ved henting av personalia, redirecter bruker til /generell-feil',
            (error as Error).message
        );
        return {
            redirect: {
                destination: '/generell-feil',
                permanent: false,
            },
        };
    }
}
