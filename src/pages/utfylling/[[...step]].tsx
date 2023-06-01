import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useFormContext } from 'react-hook-form';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import Oppsummeringssteg from '../../steps/oppsummeringssteg/Oppsummeringssteg';
import InstitusjonsoppholdSteg from '@/steps/institusjonsoppholdsteg/InstitusjonsoppholdSteg';
import ProgramDeltagelseSteg from '@/steps/programdeltagelsesteg/ProgramDeltagelseSteg';
import Tiltakssteg from '../../steps/tiltakssteg/Tiltakssteg';
import AndreUtbetalingerSteg from '../../steps/andre-utbetalingersteg/AndreUtbetalingerSteg';
import BarnetilleggSteg from '../../steps/barnetilleggsteg/BarnetilleggSteg';
import { getOnBehalfOfToken } from '@/utils/authentication';
import logger from './../../utils/serverLogger';
import { makeGetRequest } from '@/utils/http';
import { Tiltak } from '@/types/Tiltak';
import { Personalia } from '@/types/Personalia';
import Søknad from '@/types/Søknad';
import { Søknadssteg } from '@/types/Søknadssteg';
import { brukerHarFyltUtNødvendigeOpplysninger } from '@/utils/stepValidators';
import Kvitteringsside from '@/components/kvitteringsside/Kvitteringsside';
import SøknadResponse from '@/types/SøknadResponse';
import { lagFormDataForInnsending, postSøknadMultipart } from '@/utils/innsending';

interface UtfyllingProps {
    tiltak: Tiltak[];
    personalia: Personalia;
}

export default function Utfylling({ tiltak, personalia }: UtfyllingProps) {
    const router = useRouter();

    const { step } = router.query;
    const { getValues, watch, reset } = useFormContext<Søknad>();

    React.useEffect(() => {
        reset(getValues(), { keepValues: true });
    }, [step]);

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

    const brukerErPåSteg = (søknadssteg: Søknadssteg) => {
        const formStateErGyldig = brukerHarFyltUtNødvendigeOpplysninger(svar, søknadssteg);
        return step && step[0] === søknadssteg && formStateErGyldig;
    };

    const [søknadsinnsendingInProgress, setSøknadsinnsendingInProgress] = React.useState(false);
    const [innsendingstidspunkt, setInnsendingstidspunkt] = React.useState<string>();

    async function sendInnSøknad() {
        const søknad = getValues();
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
           {brukerErPåSteg(Søknadssteg.TILTAK) && (
               <Tiltakssteg
                   title="Tiltak"
                   stepNumber={1}
                   onCompleted={navigerBrukerTilProgramDeltagelseSteg}
                   onGoToPreviousStep={() => navigerBrukerTilIntroside(false)}
                   tiltak={tiltak}
                   valgtTiltak={valgtTiltak}
               />
           )}
           {brukerErPåSteg(Søknadssteg.PROGRAM_DELTAGELSE) && (
               <ProgramDeltagelseSteg
                   title="Introduksjonsprogrammet og kvalifiseringsprogrammet"
                   stepNumber={2}
                   onCompleted={navigerBrukerTilAndreUtbetalingerSteg}
                   onGoToPreviousStep={goBack}
                   valgtTiltak={valgtTiltak!}
               />
           )}
           {brukerErPåSteg(Søknadssteg.ANDRE_UTBETALINGER) && (
               <AndreUtbetalingerSteg
                   title="Andre utbetalinger"
                   stepNumber={3}
                   onCompleted={navigerBrukerTilInstitusjonsOppholdSteg}
                   onGoToPreviousStep={goBack}
                   valgtTiltak={valgtTiltak!}
               />
           )}
           {brukerErPåSteg(Søknadssteg.INSTITUSJONSOPPHOLD) && (
               <InstitusjonsoppholdSteg
                   title="Institusjonsopphold"
                   stepNumber={4}
                   onCompleted={navigerBrukerTilBarnetilleggSteg}
                   onGoToPreviousStep={goBack}
                   valgtTiltak={valgtTiltak!}
               />
           )}
           {brukerErPåSteg(Søknadssteg.BARNETILLEGG) && (
               <BarnetilleggSteg
                   title="Barnetillegg"
                   stepNumber={5}
                   onCompleted={navigerBrukerTilOppsummeringssteg}
                   onGoToPreviousStep={goBack}
                   personalia={personalia}
               />
           )}
           {brukerErPåSteg(Søknadssteg.OPPSUMMERING) && (
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
           {brukerErPåSteg(Søknadssteg.KVITTERING) && (
               <Kvitteringsside
                   personalia={personalia}
                   innsendingstidspunkt={innsendingstidspunkt!}
               />
           )}
       </>
   );
}

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
            deltakelsePeriode: { fra: '2025-04-01', til: '2025-04-10' },
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
                        { fornavn: 'Test', etternavn: 'Testesen', fødselsdato: '2025-01-01', uuid: uuidv4() },
                        { fornavn: 'Fest', etternavn: 'Festesen', fødselsdato: '2020-12-31', uuid: uuidv4() },
                    ],
                },
            },
        };
    }
}
