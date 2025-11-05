export interface Barn {
    fornavn?: string;
    mellomnavn?: string;
    etternavn?: string;
    fødselsdato: string;
    bostedsland?: string;
    uuid: string;
    adressebeskyttelse: AdressebeskyttelseDTO;
    oppholdInnenforEøs?: boolean;
    index?: number;
}

export enum AdressebeskyttelseDTO {
    STRENGT_FORTROLIG_UTLAND = 'STRENGT_FORTROLIG_UTLAND',
    STRENGT_FORTROLIG = 'STRENGT_FORTROLIG',
    FORTROLIG = 'FORTROLIG',
    UGRADERT = 'UGRADERT',
}

export interface BarnDTO {
    fødselsdato: string;
    fornavn: string | null;
    mellomnavn: string | null;
    etternavn: string | null;
    adressebeskyttelse: AdressebeskyttelseDTO;
}

export interface PersonDTO {
    fornavn: string;
    mellomnavn: string | null;
    etternavn: string;
    barn: BarnDTO[];
    harFylt18År?: boolean;
}
