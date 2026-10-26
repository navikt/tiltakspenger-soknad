import { randomUUID } from 'crypto';
import {
    DEMO_SESJON_COOKIE,
    DEMO_TIDLIGERE_SØKNAD,
    demoBehandlingsutfall,
    demoMedTidligereSøknad,
    demoSisteVedtak,
} from '@/mocks/demo';
import { InnsendteSvar } from '@/types/InnsendteSvar';
import { SisteVedtak, TidligereSøknad } from '@/types/Tiltak';
import { endredeSvar, oppsummerSvar } from '@/utils/svaroppsummering';

type Cookies = Partial<Record<string, string>>;

/** Søknadene sendt inn i demoen, per sesjon og aktivitetId. */
type Innsendinger = Map<string, Record<string, TidligereSøknad>>;

/** Demoen kjører med én replika, så innsendingene kan ligge i minnet. Eldste sesjon kastes når taket er nådd. */
const MAKS_SESJONER = 1000;

// Sidene og API-rutene bygges som egne moduler, så lageret må ligge på globalThis for å deles mellom dem.
const global = globalThis as typeof globalThis & { demoInnsendinger?: Innsendinger };
const innsendinger: Innsendinger = (global.demoInnsendinger ??= new Map());

/** Den sist mottatte søknaden for hvert tiltak demo-brukeren har søkt for, nøklet på aktivitetId. */
export function tidligereSøknaderIDemo(cookies: Cookies): Record<string, TidligereSøknad> {
    const { aktivitetId, mottatt, svar } = DEMO_TIDLIGERE_SØKNAD;
    const valgt = demoMedTidligereSøknad(cookies)
        ? { [aktivitetId]: { mottatt, svar, behandlingsutfall: demoBehandlingsutfall(cookies) } }
        : {};
    const sesjon = cookies[DEMO_SESJON_COOKIE];
    return { ...valgt, ...(sesjon ? innsendinger.get(sesjon) : undefined) };
}

/**
 * Det siste vedtaket for hvert tiltak, nøklet på aktivitetId, slik søknad-api-et serverer det.
 * Bare de valgte søknadene fra før demoen startet kan ha vedtak, se {@link demoSisteVedtak}.
 * Vedtaket er med når den sist mottatte søknaden for tiltaket ikke selv har fått vedtak, for eksempel når bruker har sendt inn en ny søknad i demoen.
 */
export function sisteVedtakIDemo(cookies: Cookies): Record<string, SisteVedtak> {
    const vedtak = demoMedTidligereSøknad(cookies) ? demoSisteVedtak(cookies) : null;
    const { aktivitetId } = DEMO_TIDLIGERE_SØKNAD;
    const nyesteUtfall = tidligereSøknaderIDemo(cookies)[aktivitetId]?.behandlingsutfall?.resultat;
    if (!vedtak || nyesteUtfall === 'INNVILGELSE' || nyesteUtfall === 'AVSLAG') {
        return {};
    }
    return { [aktivitetId]: vedtak };
}

export type Demoinnsending =
    { type: 'mottatt'; mottatt: string; nySesjon?: string } | { type: 'utenEndringer'; mottatt: string };

/**
 * Tar imot en søknad i demoen slik søknad-api-et gjør.
 * En søknad for et tiltak med de samme svarene som den sist mottatte søknaden for tiltaket, avvises.
 * Er den sist mottatte søknaden ferdig behandlet, tas den nye søknaden imot.
 */
export function mottaDemosøknad(cookies: Cookies, svar: InnsendteSvar, nå: Date = new Date()): Demoinnsending {
    const tidligere = tidligereSøknaderIDemo(cookies)[svar.tiltak.aktivitetId];
    if (
        tidligere &&
        !tidligere.behandlingsutfall &&
        endredeSvar(oppsummerSvar(svar), oppsummerSvar(tidligere.svar)).length === 0
    ) {
        return { type: 'utenEndringer', mottatt: tidligere.mottatt };
    }
    const nySesjon = cookies[DEMO_SESJON_COOKIE] ? undefined : randomUUID();
    const sesjon = (cookies[DEMO_SESJON_COOKIE] ?? nySesjon)!;
    const mottatt = nå.toISOString();
    const søknader = innsendinger.get(sesjon) ?? {};
    innsendinger.delete(sesjon);
    innsendinger.set(sesjon, { ...søknader, [svar.tiltak.aktivitetId]: { mottatt, svar } });
    if (innsendinger.size > MAKS_SESJONER) {
        innsendinger.delete(innsendinger.keys().next().value!);
    }
    return { type: 'mottatt', mottatt, nySesjon };
}
