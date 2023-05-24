import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FormProvider, useForm } from 'react-hook-form';
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

interface UtfyllingProps {
    tiltak: Tiltak[];
    personalia: Personalia;
    setPersonaliaData: (personalia: Personalia) => void;
}

export default function Utfylling({ tiltak, personalia, setPersonaliaData }: UtfyllingProps) {
    const router = useRouter();

    React.useEffect(() => {
        setPersonaliaData(personalia);
    }, [personalia]);

    const { step } = router.query;
    const formMethods = useForm<Søknad>({
        defaultValues: {
            svar: {
                tiltak: {},
                barnetillegg: {
                    eøsOppholdForBarnFraAPI: {},
                    manueltRegistrerteBarnSøktBarnetilleggFor: [],
                },
                institusjonsopphold: {},
                introduksjonsprogram: {},
                kvalifiseringsprogram: {},
                mottarAndreUtbetalinger: false,
                sykepenger:{},
                gjenlevendepensjon: {},
                alderspensjon: {},
                supplerendestønadover67: {},
                supplerendestønadflyktninger: {},
                pensjonsordning: {},
                etterlønn: {},
                jobbsjansen: {},
                harBekreftetAlleOpplysninger: false,
            },
            vedlegg: [],
        },
    });

    const [valgtTiltak, setValgtTiltak] = React.useState<Tiltak | null>(null);
    const valgtAktivitetId = formMethods.watch('svar.tiltak.aktivitetId');
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
            default:
                return null;
        }
    }

    const svar = formMethods.getValues().svar;
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
    const navigerBrukerTilInstitusjonsOppholdSteg = (shallow: boolean = true) => navigateToPath('/utfylling/institusjonsopphold', shallow);
    const navigerBrukerTilAndreUtbetalingerEllerInstitusjonsopphold = (shallow: boolean =true) => {
        if (svar.mottarAndreUtbetalinger) {
            navigateToPath('/utfylling/andreutbetalinger', shallow);
        } else {
            navigateToPath('/utfylling/institusjonsopphold', shallow);
        }
    }
    const navigerBrukerTilBarnetilleggSteg = (shallow: boolean = true) =>
        navigateToPath('/utfylling/barnetillegg', shallow);
    const navigerBrukerTilOppsummeringssteg = (shallow: boolean = true) =>
        navigateToPath('/utfylling/oppsummering', shallow);

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

    const hentStegNummerTekst = (stegNummer: number) => {
        let totalSteg = 5;
        if(svar.mottarAndreUtbetalinger) {
            return `Steg ${stegNummer+1} av ${totalSteg+1}`;
        }
        return `Steg ${stegNummer} av ${totalSteg}`;
    }

    return (
        <FormProvider {...formMethods}>
            {brukerErPåTiltakssteg() && (
                <Tiltakssteg
                    title="Tiltak"
                    stegNummerTekst={hentStegNummerTekst(1)}
                    onCompleted={navigerBrukerTilProgramDeltagelseSteg}
                    onGoToPreviousStep={() => navigerBrukerTilIntroside(false)}
                    tiltak={tiltak}
                    valgtTiltak={valgtTiltak}
                />
            )}
            {brukerErPåProgramDeltagelseSteg() && (
                <ProgramDeltagelseSteg
                    title="Andre utbetalinger og programdeltagelse"
                    stegNummerTekst={hentStegNummerTekst(2)}
                    onCompleted={navigerBrukerTilAndreUtbetalingerEllerInstitusjonsopphold}
                    onGoToPreviousStep={goBack}
                    valgtTiltak={valgtTiltak!}
                />
            )}
            {brukerErPåAndreUtbetalingerSteg() && (
                <AndreUtbetalingerSteg
                    title="Andre utbetalinger"
                    stegNummerTekst={hentStegNummerTekst(2)}
                    onCompleted={navigerBrukerTilInstitusjonsOppholdSteg}
                    onGoToPreviousStep={goBack} />
            )}
            {brukerErPåInstitusjonsoppholdSteg() && (
                <InstitusjonsoppholdSteg
                    title="Institusjonsopphold"
                    stegNummerTekst={hentStegNummerTekst(3)}
                    onCompleted={navigerBrukerTilBarnetilleggSteg}
                    onGoToPreviousStep={goBack}
                    valgtTiltak={valgtTiltak!}
                />
            )}
            {brukerErPåBarnetilleggSteg() && (
                <BarnetilleggSteg
                    title="Barnetillegg"
                    stegNummerTekst={hentStegNummerTekst(4)}
                    onCompleted={navigerBrukerTilOppsummeringssteg}
                    onGoToPreviousStep={goBack}
                    personalia={personalia}
                />
            )}
            {brukerErPåOppsummeringssteg() && (
                <Oppsummeringssteg
                    title="Oppsummering"
                    stegNummerTekst={hentStegNummerTekst(5)}
                    onGoToPreviousStep={goBack}
                    personalia={personalia}
                    valgtTiltak={valgtTiltak!} />
            )}
        </FormProvider>
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
                    barn: [{ fornavn: 'Test', etternavn: 'Testesen', fødselsdato: '2025-01-01', uuid: uuidv4() },{ fornavn: 'Fest', etternavn: 'Festesen', fødselsdato: '2020-12-31', uuid: uuidv4() }],
                },
            },
        };
    }
}
