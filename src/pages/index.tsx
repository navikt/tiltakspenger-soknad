import React, { ReactElement, useContext, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { Button, Heading, Link } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import Accordion from '@/components/accordion/Accordion';
import Bekreftelsesspørsmål from '@/components/bekreftelsesspørsmål/Bekreftelsesspørsmål';
import Søknad from '@/types/Søknad';
import { påkrevdBekreftelsesspørsmål } from '@/utils/formValidators';
import { Personalia } from '@/types/Personalia';
import { UtfyllingSetStateContext } from '@/pages/_app';
import { GetServerSidePropsContext } from 'next';
import logger from '@/utils/serverLogger';
import { getOnBehalfOfToken, redirectToLogin } from '@/utils/authentication';
import { makeGetRequest } from '@/utils/http';
import styles from './index.module.css';
import SøknadLayout from '@/components/søknad-layout/SøknadLayout';
import IkkeMyndig from '@/components/ikke-myndig/IkkeMyndig';
import CustomGuidePanel from '@/components/custom-guide-panel/CustomGuidePanel';
import { pageWithAuthentication } from '@/utils/pageWithAuthentication';
import { mockedPersonalia } from '@/mocks/mockedPersonalia';

function harBekreftetÅSvareSåGodtManKanValidator(verdi: boolean) {
    return påkrevdBekreftelsesspørsmål(
        verdi,
        'Du må bekrefte at du vil svare så godt du kan på spørsmålene som blir stilt i søknaden',
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
                <p>Du må lese gjennom informasjonen under før du starter søknaden.</p>
            </CustomGuidePanel>
            <div className={styles.accordions}>
                <Accordion header="Tiltakspenger og annen inntekt">
                    <span>Du kan ikke få tiltakspenger hvis:</span>
                    <ul>
                        <li>du får annen pengestøtte som helt eller delvis skal dekke dine daglige utgifter</li>
                        <li>du har en jobb som hindrer deg i å delta på tiltaket</li>
                        <li>jobben du får lønn for er en del av tiltaket</li>
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
                        <li>Personinformasjon om deg fra Folkeregisteret</li>
                        <li>Personinformasjon om barna dine hvis du søker om barnetillegg</li>
                        <li>Inntektsinformasjon fra Skatteetaten</li>
                        <li>Opplysninger om hvilket arbeidsmarkedstiltak du deltar på</li>
                        <li>Opplysninger om du får andre utbetalinger fra Nav</li>
                    </ul>
                    <p>Dette gjør vi for å vurdere om du har rett til tiltakspenger.</p>
                    <p>Vi deler informasjon med andre systemer i Nav:</p>
                    <ul>
                        <li>om du har tiltakspenger</li>
                        <li>hvilken periode du har tiltakspenger</li>
                    </ul>
                    <p>
                        hvis informasjonen har betydning for andre ytelser du har søkt om eller oppfølgingen du får av
                        Nav.
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
                <Button type="submit">Start søknaden</Button>
            </div>
        </form>
    );
}

IndexPage.getLayout = function getLayout(page: ReactElement) {
    return <SøknadLayout>{page}</SøknadLayout>;
};

const getServerSidePropsLive = pageWithAuthentication(async (context: GetServerSidePropsContext) => {
    const backendUrl = process.env.TILTAKSPENGER_SOKNAD_API_URL;

    let token = null;
    try {
        token = await getOnBehalfOfToken(context.req.headers.authorization!!);
    } catch (error) {
        logger.error(`Bruker har ikke tilgang: ${(error as Error).message}`);
        return redirectToLogin(context);
    }

    try {
        const personaliaResponse = await makeGetRequest(`${backendUrl}/personalia`, token);
        if (personaliaResponse.ok) {
            const personaliaJson = await personaliaResponse.json();
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
        } else {
            throw new Error(`${personaliaResponse.status} ${personaliaResponse.statusText}`);
        }
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            logger.error((error as Error).message);
            return {
                props: {
                    personalia: mockedPersonalia,
                },
            };
        }

        logger.error(
            `Noe gikk galt ved henting av personalia: ${(error as Error).message}. Redirecter bruker til /generell-feil`,
        );
        return {
            redirect: {
                destination: '/generell-feil',
                permanent: false,
            },
        };
    }
});

const getServerSidePropsDemo = async () => {
    return {
        props: {
            personalia: mockedPersonalia,
        },
    };
};

export const getServerSideProps = process.env.IS_DEMO_MODE === 'true' ? getServerSidePropsDemo : getServerSidePropsLive;
