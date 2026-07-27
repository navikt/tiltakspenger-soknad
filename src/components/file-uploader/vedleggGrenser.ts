/**
 * Grensene her speiler `VedleggValidering.kt` i tiltakspenger-soknad-api.
 *
 * Valideringen i søknadsdialogen er ikke en sikkerhetsgrense — backend håndhever de samme tallene på nytt, fordi endepunktet tar imot multipart fra alle med et gyldig token.
 * Poenget med å ha dem her er brukeropplevelsen: uten dem oppdager brukeren først ved innsending at et vedlegg er for stort, etter å ha fylt ut hele søknaden.
 *
 * Endrer du et tall her, må det endres samme sted i backend.
 */

/** Maks størrelse på ett enkelt vedlegg, i bytes. */
export const MAKS_FILSTØRRELSE_BYTES = 10_000_000;

/**
 * Maks antall vedlegg for hele søknaden, på tvers av barna.
 *
 * Grensen gjelder søknaden, ikke det enkelte barnet — det er slik backend teller.
 * Vedleggene er knyttet til hvert barn her i dialogen, men koblingen sendes ikke med: `lagFormDataForInnsending` legger dem på som `vedlegg-0`, `vedlegg-1` osv., så soknad-api ser bare en flat liste.
 */
export const MAKS_ANTALL_VEDLEGG = 10;

/** Maks samlet størrelse på alle vedleggene i søknaden. */
export const MAKS_TOTAL_FILSTØRRELSE_BYTES = 50_000_000;

/** Speiler `godkjenteFiltyper` i backendens `Detect.kt`, som sjekker de faktiske magic bytes — ikke bare filendelsen. */
export const GODKJENTE_FILTYPER = 'image/jpg,image/jpeg,image/png,application/pdf';

const BYTES_PER_MB = 1_000_000;

/** Grensene skrevet slik de vises til brukeren, uten desimaler så lenge de er et helt antall MB. */
export const maksFilstørrelseTekst = `${MAKS_FILSTØRRELSE_BYTES / BYTES_PER_MB} MB`;
export const maksTotalStørrelseTekst = `${MAKS_TOTAL_FILSTØRRELSE_BYTES / BYTES_PER_MB} MB`;

/**
 * Feilmelding for én fil Aksel har avvist.
 * Grunnene kommer fra `fileRejectionReason` i ds-react, og en fil kan brytes mot flere — størrelse nevnes først fordi den er den vanligste og mest handlingsbare.
 */
export function feilmeldingForAvvistFil(filnavn: string, grunner: string[]): string {
    if (grunner.includes('fileSize')) {
        return `«${filnavn}» er større enn ${maksFilstørrelseTekst} og ble ikke lagt til.`;
    }
    if (grunner.includes('fileType')) {
        return `«${filnavn}» ble ikke lagt til. Vedlegg må være PDF, JPG eller PNG.`;
    }
    return `«${filnavn}» ble ikke lagt til.`;
}

/**
 * Feilmelding når brukeren velger flere filer enn det er plass til.
 * `fileLimit` på dropsonen deaktiverer den først når grensen allerede er nådd, så den fanger ikke at det velges flere filer på én gang enn det er plass til.
 */
export function feilmeldingForAntall(antallAvvist: number): string {
    return antallAvvist === 1
        ? `Ett vedlegg ble ikke lagt til. Søknaden kan ha maks ${MAKS_ANTALL_VEDLEGG} vedlegg.`
        : `${antallAvvist} vedlegg ble ikke lagt til. Søknaden kan ha maks ${MAKS_ANTALL_VEDLEGG} vedlegg.`;
}

/** Feilmelding når vedleggene til sammen blir for store, selv om hver enkelt er innenfor. */
export function feilmeldingForTotalStørrelse(antallAvvist: number): string {
    return antallAvvist === 1
        ? `Ett vedlegg ble ikke lagt til. Vedleggene kan til sammen være maks ${maksTotalStørrelseTekst}.`
        : `${antallAvvist} vedlegg ble ikke lagt til. Vedleggene kan til sammen være maks ${maksTotalStørrelseTekst}.`;
}

/**
 * Teksten dropsonen viser når antallsgrensen er nådd og den er deaktivert.
 * Overstyrer Aksel sin default («Du kan ikke laste opp flere filer»), som ikke sier hvor grensen går.
 */
export const tekstNårGrensenErNådd = `Du kan ikke laste opp flere vedlegg. Søknaden kan ha maks ${MAKS_ANTALL_VEDLEGG} vedlegg.`;
