export interface Barn {
    fornavn?: string;
    mellomnavn?: string;
    etternavn?: string;
    fødselsdato: string;
    bostedsland?: string;
    uuid: string;
    fnr: string | null;
    oppholdInnenforEøs?: boolean;
    index?: number;
}

export interface BarnDTO {
    fødselsdato: string;
    fornavn: string | null;
    mellomnavn: string | null;
    etternavn: string | null;
    fnr: string;
}

export interface PersonDTO {
    fornavn: string;
    mellomnavn: string | null;
    etternavn: string;
    barn: BarnDTO[];
    harFylt18År?: boolean;
}
