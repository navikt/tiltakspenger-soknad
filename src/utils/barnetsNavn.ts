export interface Navnedeler {
    fornavn?: string | null;
    mellomnavn?: string | null;
    etternavn?: string | null;
}

export const UKJENT_NAVN = 'Ukjent navn';

/** Setter sammen de kjente delene av navnet, eller gir undefined når ingen av dem er kjent. */
export function formaterBarnetsNavn({ fornavn, mellomnavn, etternavn }: Navnedeler): string | undefined {
    const navn = [fornavn, mellomnavn, etternavn]
        .map((del) => del?.trim())
        .filter((del) => !!del)
        .join(' ');
    return navn || undefined;
}

export function visningsnavnForBarn(barn: Navnedeler): string {
    return formaterBarnetsNavn(barn) ?? UKJENT_NAVN;
}
