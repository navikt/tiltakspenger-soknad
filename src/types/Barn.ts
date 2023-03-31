export interface SelvregistrertBarn {
    fornavn: string;
    mellomnavn?: string;
    etternavn: string;
    fødselsdato: string;
    bostedsland: string;
}

export interface BarnFraAPI {
    fornavn?: string;
    mellomnavn?: string;
    etternavn?: string;
    fødselsdato: string;
}
