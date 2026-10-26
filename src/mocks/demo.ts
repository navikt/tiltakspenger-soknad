import { mocketTiltak } from '@/mocks/mockedTiltak';
import { mocketTidligereSvar } from '@/mocks/mockedTidligereSøknad';
import { mockedBarn } from '@/mocks/mockedPersonalia';
import { Behandlingsutfall, SisteVedtak, TidligereSøknad, Tiltak } from '@/types/Tiltak';

/** Cookien som husker om demo-brukeren har sendt inn en søknad tidligere. */
export const DEMO_TIDLIGERE_SØKNAD_COOKIE = 'demo-tidligere-soknad';

/** Cookien som husker resultatet av behandlingen av søknaden demo-brukeren har sendt inn tidligere. */
export const DEMO_TIDLIGERE_SØKNAD_RESULTAT_COOKIE = 'demo-tidligere-soknad-resultat';

/** Resultatene som kan velges for den tidligere søknaden i demoen. */
export const DEMO_RESULTATER = ['UNDER_BEHANDLING', 'INNVILGELSE', 'AVSLAG', 'AVBRUTT'] as const;
export type DemoResultat = (typeof DEMO_RESULTATER)[number];

/** Cookien som husker vedtaket på en eldre søknad enn den tidligere søknaden i demoen. */
export const DEMO_TIDLIGERE_VEDTAK_COOKIE = 'demo-tidligere-vedtak';

/** Vedtakene som kan velges for den eldre søknaden. */
export const DEMO_VEDTAK = ['INGEN', 'INNVILGELSE', 'AVSLAG'] as const;
export type DemoVedtak = (typeof DEMO_VEDTAK)[number];

/** Cookien som knytter søknadene demo-brukeren sender inn, til nettleseren. */
export const DEMO_SESJON_COOKIE = 'demo-sesjon';

/**
 * Søknaden demo-brukeren har sendt inn tidligere, når det er valgt i demo-modus.
 * Den søker barnetillegg for barna demo-API-et henter fra Folkeregisteret, slik at en uendret søknad kan sendes inn på nytt og avvises.
 * Navn som mangler er `null`, som fra søknad-api-et, siden Next ikke kan sende `undefined` til siden.
 */
export const DEMO_TIDLIGERE_SØKNAD: { aktivitetId: string } & TidligereSøknad = {
    aktivitetId: '45avk6',
    mottatt: '2025-03-03T10:15:00',
    svar: {
        ...mocketTidligereSvar,
        barnetillegg: {
            ...mocketTidligereSvar.barnetillegg,
            registrerteBarnSøktBarnetilleggFor: mockedBarn.map(
                ({ fnr, fornavn, mellomnavn, etternavn, fødselsdato }) => ({
                    fnr: fnr!,
                    fornavn: fornavn ?? null,
                    mellomnavn: mellomnavn ?? null,
                    etternavn: etternavn ?? null,
                    fødselsdato,
                    oppholdssted: 'NORGE',
                }),
            ),
        },
    },
};

export function demoMedTidligereSøknad(cookies: Partial<Record<string, string>>): boolean {
    return cookies[DEMO_TIDLIGERE_SØKNAD_COOKIE] === 'true';
}

/** Resultatet som er valgt for den tidligere søknaden i demoen, eller under behandling om ikke noe gyldig er valgt. */
export function demoTidligereSøknadResultat(cookies: Partial<Record<string, string>>): DemoResultat {
    const valgt = cookies[DEMO_TIDLIGERE_SØKNAD_RESULTAT_COOKIE];
    return DEMO_RESULTATER.find((resultat) => resultat === valgt) ?? 'UNDER_BEHANDLING';
}

/** Utfallet søknad-api-et ville sendt for den tidligere søknaden i demoen, eller null når den er under behandling. */
export function demoBehandlingsutfall(cookies: Partial<Record<string, string>>): Behandlingsutfall | null {
    const resultat = demoTidligereSøknadResultat(cookies);
    return resultat === 'UNDER_BEHANDLING' ? null : { resultat, tidspunkt: '2025-04-10T09:00:00' };
}

/** Vedtaket som er valgt for den eldre søknaden, eller ingen om ikke noe gyldig er valgt. */
export function demoTidligereVedtak(cookies: Partial<Record<string, string>>): DemoVedtak {
    const valgt = cookies[DEMO_TIDLIGERE_VEDTAK_COOKIE];
    return DEMO_VEDTAK.find((vedtak) => vedtak === valgt) ?? 'INGEN';
}

/** Når vi mottok den eldre søknaden, som ble behandlet før demo-brukeren sendte inn den tidligere søknaden. */
export const DEMO_ELDRE_SØKNAD_MOTTATT = '2025-01-06T10:15:00';

/**
 * Det siste vedtaket blant søknadene demo-brukeren har sendt inn tidligere, eller null om ingen av dem har fått vedtak.
 * Har den tidligere søknaden fått vedtak, er det det.
 * Ellers er det vedtaket som eventuelt er valgt for den eldre søknaden.
 */
export function demoSisteVedtak(cookies: Partial<Record<string, string>>): SisteVedtak | null {
    const utfall = demoBehandlingsutfall(cookies);
    if (utfall?.resultat === 'INNVILGELSE' || utfall?.resultat === 'AVSLAG') {
        return { søknadMottatt: DEMO_TIDLIGERE_SØKNAD.mottatt, behandlingsutfall: utfall };
    }
    const vedtak = demoTidligereVedtak(cookies);
    return vedtak === 'INGEN'
        ? null
        : {
              søknadMottatt: DEMO_ELDRE_SØKNAD_MOTTATT,
              behandlingsutfall: { resultat: vedtak, tidspunkt: '2025-02-03T09:00:00' },
          };
}

/**
 * De mockede tiltakene, med den sist mottatte søknaden og det siste vedtaket for hvert tiltak, nøklet på aktivitetId.
 * Next kan ikke sende `undefined` til siden, så tiltak uten noe av dette får dem ikke som felt.
 */
export function mocketTiltakForDemo(
    tidligereSøknader: Record<string, TidligereSøknad>,
    sisteVedtak: Record<string, SisteVedtak> = {},
): Tiltak[] {
    return (mocketTiltak as unknown as Tiltak[]).map((tiltak) => {
        const tidligereSøknad = tidligereSøknader[tiltak.aktivitetId];
        const vedtak = sisteVedtak[tiltak.aktivitetId];
        return {
            ...tiltak,
            ...(tidligereSøknad && { tidligereSøknad }),
            ...(vedtak && { sisteVedtak: vedtak }),
        };
    });
}
