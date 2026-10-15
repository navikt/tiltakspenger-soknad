export interface Barn {
    fornavn?: string;
    mellomnavn?: string;
    etternavn?: string;
    fødselsdato: string;
    uuid: string;
    fnr: string | null;
    borINorge?: boolean;
    borIEøs?: boolean;
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
    harFylt18År?: boolean;
}

export interface BarnListeDTO {
    barn: BarnDTO[];
}
