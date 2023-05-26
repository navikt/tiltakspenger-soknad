import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useFormContext } from 'react-hook-form';
import { useRouter } from 'next/router';
import Oppsummeringssteg from '../../steps/oppsummeringssteg/Oppsummeringssteg';
import InstitusjonsoppholdSteg from '@/steps/institusjonsoppholdsteg/InstitusjonsoppholdSteg';
import ProgramDeltagelseSteg from '@/steps/programdeltagelsesteg/ProgramDeltagelseSteg';
import Tiltakssteg from '../../steps/tiltakssteg/Tiltakssteg';
import AndreUtbetalingerSteg from '../../steps/andre-utbetalingersteg/AndreUtbetalingerSteg';
import BarnetilleggSteg from '../../steps/barnetilleggsteg/BarnetilleggSteg';
import { getOnBehalfOfToken } from '@/utils/authentication';
import { GetServerSidePropsContext } from 'next';
import logger from './../../utils/serverLogger';
import { makeGetRequest } from '@/utils/http';
import { Tiltak } from '@/types/Tiltak';
import { Personalia } from '@/types/Personalia';
import Søknad from '@/types/Søknad';
import { Søknadssteg } from '@/types/Søknadssteg';
import { brukerHarFyltUtNødvendigeOpplysninger } from '@/utils/stepValidators';
import Kvitteringsside from '@/components/kvitteringsside/Kvitteringsside';
import SøknadResponse from '@/types/SøknadResponse';
import toSøknadJson from '@/utils/toSøknadJson';

interface UtfyllingProps {
    tiltak: Tiltak[];
    personalia: Personalia;
}

export default function Utfylling({ tiltak, personalia }: UtfyllingProps) {
    const router = useRouter();

    const { step } = router.query;
    const { getValues, watch } = useFormContext<Søknad>();

    const [valgtTiltak, setValgtTiltak] = React.useState<Tiltak | null>(null);
    const valgtAktivitetId = watch('svar.tiltak.aktivitetId');
    React.useEffect(() => {
        const matchendeTiltak = tiltak.find(({ aktivitetId }) => aktivitetId === valgtAktivitetId);
        if (matchendeTiltak) {
            setValgtTiltak(matchendeTiltak);
        }
    }, [valgtAktivitetId]);

    function utledSøknadsstegFraRoute(route: string | undefined): Søknadssteg | null {
        switch (route) {
            case Søknadssteg.TILTAK:
                return Søknadssteg.TILTAK;
            case Søknadssteg.PROGRAM_DELTAGELSE:
                return Søknadssteg.PROGRAM_DELTAGELSE;
            case Søknadssteg.ANDRE_UTBETALINGER:
                return Søknadssteg.ANDRE_UTBETALINGER;
            case Søknadssteg.INSTITUSJONSOPPHOLD:
                return Søknadssteg.INSTITUSJONSOPPHOLD;
            case Søknadssteg.BARNETILLEGG:
                return Søknadssteg.BARNETILLEGG;
            case Søknadssteg.OPPSUMMERING:
                return Søknadssteg.OPPSUMMERING;
            case Søknadssteg.KVITTERING:
                return Søknadssteg.KVITTERING;
            default:
                return null;
        }
    }

    const svar = getValues().svar;
    const aktivtSøknadssteg = utledSøknadsstegFraRoute(step && step[0]);
    React.useEffect(() => {
        if (aktivtSøknadssteg == null) {
            navigateToPath('/404', false);
        }
        if (!brukerHarFyltUtNødvendigeOpplysninger(svar, aktivtSøknadssteg!)) {
            navigateToPath('/', false);
        }
    }, [step]);

    function navigateToPath(path: string, shallow: boolean) {
        return router.push(path, undefined, { shallow });
    }

    function goBack() {
        return router.back();
    }

    const navigerBrukerTilIntroside = (shallow: boolean = true) => navigateToPath('/', shallow);
    const navigerBrukerTilProgramDeltagelseSteg = (shallow: boolean = true) => navigateToPath('/utfylling/programdeltagelse', shallow);
    const navigerBrukerTilAndreUtbetalingerSteg = (shallow: boolean = true) =>
        navigateToPath('/utfylling/andreutbetalinger', shallow);
    const navigerBrukerTilInstitusjonsOppholdSteg = (shallow: boolean = true) =>
        navigateToPath('/utfylling/institusjonsopphold', shallow);
    const navigerBrukerTilBarnetilleggSteg = (shallow: boolean = true) =>
        navigateToPath('/utfylling/barnetillegg', shallow);
    const navigerBrukerTilOppsummeringssteg = (shallow: boolean = true) =>
        navigateToPath('/utfylling/oppsummering', shallow);
    const navigerBrukerTilKvitteringssiden = (shallow: boolean = true) =>
        navigateToPath('/utfylling/kvittering', shallow);
    const navigerBrukerTilGenerellFeilside = () => navigateToPath('/feil', false);

    const brukerErPåTiltakssteg = () => {
        const formStateErPåTiltakssteg = brukerHarFyltUtNødvendigeOpplysninger(svar, Søknadssteg.TILTAK);
        return step && step[0] === Søknadssteg.TILTAK && formStateErPåTiltakssteg;
    };

    const brukerErPåProgramDeltagelseSteg = () => {
        const formStateErPåProgramDeltagelsesteg = brukerHarFyltUtNødvendigeOpplysninger(svar, Søknadssteg.PROGRAM_DELTAGELSE);
        return step && step[0] === Søknadssteg.PROGRAM_DELTAGELSE && formStateErPåProgramDeltagelsesteg;
    };

    const brukerErPåInstitusjonsoppholdSteg = () => {
        const formStateErPåInstitusjonsoppholdsteg = brukerHarFyltUtNødvendigeOpplysninger(svar, Søknadssteg.INSTITUSJONSOPPHOLD);
        return step && step[0] === Søknadssteg.INSTITUSJONSOPPHOLD && formStateErPåInstitusjonsoppholdsteg;
    };

    const brukerErPåAndreUtbetalingerSteg = () => {
        const formStateErPåAndreUtbetalingerSteg = brukerHarFyltUtNødvendigeOpplysninger(
            svar,
            Søknadssteg.ANDRE_UTBETALINGER
        );
        return step && step[0] === Søknadssteg.ANDRE_UTBETALINGER && formStateErPåAndreUtbetalingerSteg;
    };

    const brukerErPåBarnetilleggSteg = () => {
        const formStateErPåBarnetilleggSteg = brukerHarFyltUtNødvendigeOpplysninger(svar, Søknadssteg.BARNETILLEGG);
        return step && step[0] === Søknadssteg.BARNETILLEGG && formStateErPåBarnetilleggSteg;
    };

    const brukerErPåOppsummeringssteg = () => {
        const formStateErPåOppsummeringssteg = brukerHarFyltUtNødvendigeOpplysninger(svar, Søknadssteg.OPPSUMMERING);
        return step && step[0] === Søknadssteg.OPPSUMMERING && formStateErPåOppsummeringssteg;
    };

    const brukerErPåKvitteringssiden = () => {
        const formStateErPåKvitteringssiden = brukerHarFyltUtNødvendigeOpplysninger(svar, Søknadssteg.KVITTERING);
        return step && step[0] === Søknadssteg.KVITTERING && formStateErPåKvitteringssiden;
    };

    function lagFormDataForInnsending(søknad: Søknad, personalia: Personalia, valgtTiltak: Tiltak): FormData {
        const søknadJson = toSøknadJson(søknad.svar, personalia.barn, valgtTiltak);
        const formData = new FormData();
        formData.append('søknad', søknadJson as string);
        søknad.vedlegg.filter((v) =>
            søknad.svar.barnetillegg.manueltRegistrerteBarnSøktBarnetilleggFor.find((elem) => elem.uuid === v.uuid) != undefined
        ).forEach((vedlegg, index) => {
            formData.append(`vedlegg-${index}`, vedlegg.file);
        });
        return formData;
    }

    function postSøknadMultipart(formData: FormData) {
        return fetch('/api/soknad', {
            method: 'POST',
            body: formData,
        });
    }

    const [søknadsinnsendingInProgress, setSøknadsinnsendingInProgress] = React.useState(false);
    const [innsendingstidspunkt, setInnsendingstidspunkt] = React.useState<string>();

    async function sendInnSøknad() {
        const søknad = getValues();
        console.log("søknad: ", søknad);
        const formData = lagFormDataForInnsending(søknad, personalia, valgtTiltak!);
        try {
            setSøknadsinnsendingInProgress(true);
            const response = await postSøknadMultipart(formData);
            if (response.status !== 201) {
                return navigerBrukerTilGenerellFeilside();
            }

            const innsendingstidspunktFraApi = await response
                .json()
                .then((json: SøknadResponse) => json.innsendingTidspunkt);
            setInnsendingstidspunkt(innsendingstidspunktFraApi);
            return navigerBrukerTilKvitteringssiden();
        } catch {
            return navigerBrukerTilGenerellFeilside();
        }
    }

     return (
         <>
             {brukerErPåTiltakssteg() && (
                 <Tiltakssteg
                     title="Tiltak"
                     stepNumber={1}
                     onCompleted={navigerBrukerTilProgramDeltagelseSteg}
                     onGoToPreviousStep={() => navigerBrukerTilIntroside(false)}
                     tiltak={tiltak}
                     valgtTiltak={valgtTiltak}
                 />
             )}
             {brukerErPåProgramDeltagelseSteg() && (
                 <ProgramDeltagelseSteg
                     title="Programdeltagelse"
                     stepNumber={2}
                     onCompleted={navigerBrukerTilAndreUtbetalingerSteg}
                     onGoToPreviousStep={goBack}
                     valgtTiltak={valgtTiltak!}
                 />
             )}
             {brukerErPåAndreUtbetalingerSteg() && (
                 <AndreUtbetalingerSteg
                     title="Andre utbetalinger"
                     stepNumber={3}
                     onCompleted={navigerBrukerTilInstitusjonsOppholdSteg}
                     onGoToPreviousStep={goBack}
                     valgtTiltak={valgtTiltak!}
                 />
             )}
             {brukerErPåInstitusjonsoppholdSteg() && (
                 <InstitusjonsoppholdSteg
                     title="Institusjonsopphold"
                     stepNumber={4}
                     onCompleted={navigerBrukerTilBarnetilleggSteg}
                     onGoToPreviousStep={goBack}
                     valgtTiltak={valgtTiltak!}
                 />
             )}
             {brukerErPåBarnetilleggSteg() && (
                 <BarnetilleggSteg
                     title="Barnetillegg"
                     stepNumber={5}
                     onCompleted={navigerBrukerTilOppsummeringssteg}
                     onGoToPreviousStep={goBack}
                     personalia={personalia}
                 />
             )}
             {brukerErPåOppsummeringssteg() && (
                 <Oppsummeringssteg
                     title="Oppsummering"
                     stepNumber={6}
                     onGoToPreviousStep={goBack}
                     personalia={personalia}
                     valgtTiltak={valgtTiltak!}
                     søknadsinnsendingInProgress={søknadsinnsendingInProgress}
                     onCompleted={sendInnSøknad}
                 />
             )}
             {brukerErPåKvitteringssiden() && (
                 <Kvitteringsside
                     personalia={personalia}
                     innsendingstidspunkt={innsendingstidspunkt!}
                 />
             )}
         </>
     );
}

    export async function getServerSideProps({req}: GetServerSidePropsContext) {
        let token = null;
        try {
            logger.info('Henter token');
            const authorizationHeader = req.headers.authorization;
            if (!authorizationHeader) {
                throw new Error('Mangler token');
            }
            token = await getOnBehalfOfToken(authorizationHeader);
        } catch (error) {
            logger.info('Bruker har ikke tilgang', error);
            return {
                redirect: {
                    destination: '/oauth2/login',
                    permanent: false,
                },
            };
        }

        const backendUrl = process.env.TILTAKSPENGER_SOKNAD_API_URL;
        const mocketTiltak = [
            {
                aktivitetId: '123',
                type: 'Annen utdanning',
                typeNavn: 'Annen utdanning',
                deltakelsePeriode: {fra: '2025-04-01', til: '2025-04-10'},
                arrangør: 'Testarrangør',
                status: 'Aktuell',
            },
        ];

        try {
            const tiltakResponse = await makeGetRequest(`${backendUrl}/tiltak`, token);
            const tiltakJson = await tiltakResponse.json();
            const personaliaResponse = await makeGetRequest(`${backendUrl}/personalia`, token);
            const personaliaJson = await personaliaResponse.json();
            const svarMedMocketTiltak = !tiltakJson.tiltak || tiltakJson.tiltak.length === 0;
            return {
                props: {
                    tiltak: svarMedMocketTiltak ? mocketTiltak : tiltakJson.tiltak,
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
            logger.error((error as Error).message);
            return {
                props: {
                    tiltak: mocketTiltak,
                    personalia: {
                        fornavn: 'Foo',
                        mellomnavn: 'Bar',
                        etternavn: 'Baz',
                        fødselsnummer: '123',
                        barn: [
                            {fornavn: 'Test', etternavn: 'Testesen', fødselsdato: '2025-01-01', uuid: uuidv4()},
                            {fornavn: 'Fest', etternavn: 'Festesen', fødselsdato: '2020-12-31', uuid: uuidv4()},
                        ],
                    },
                },
            };
        }
    }
