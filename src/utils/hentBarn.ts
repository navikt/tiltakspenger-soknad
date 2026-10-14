import { v4 as uuidv4 } from 'uuid';
import { Barn, BarnListeDTO } from '@/types/Barn';
import { mockedBarn } from '@/mocks/mockedPersonalia';

export async function hentBarnFraFolkeregisteret(): Promise<Barn[]> {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
    try {
        const response = await fetch(`${basePath}/api/personalia/barn`);
        if (!response.ok) {
            throw new Error(`Henting av barn feilet med status ${response.status}`);
        }
        const { barn } = (await response.json()) as BarnListeDTO;
        return barn.map(({ fnr, fødselsdato, fornavn, mellomnavn, etternavn }) => ({
            fnr,
            fødselsdato,
            fornavn: fornavn ?? undefined,
            mellomnavn: mellomnavn ?? undefined,
            etternavn: etternavn ?? undefined,
            uuid: uuidv4(),
        }));
    } catch (error) {
        // Lokalt kjører vi ofte uten søknad-api, slik som når personalia hentes på forsiden.
        if (process.env.NODE_ENV === 'development') {
            return mockedBarn;
        }
        throw error;
    }
}
