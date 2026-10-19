interface SøknadResponse {
    innsendingTidspunkt: string;
}

export default SøknadResponse;

/** Svaret med status 409 når søknaden har samme tiltak, periode og svar som en søknad vi allerede har mottatt. */
export interface SøknadUtenEndringerResponse {
    kode: 'SØKNAD_UTEN_ENDRINGER';
    mottatt: string;
    melding: string;
}
