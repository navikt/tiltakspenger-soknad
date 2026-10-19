import Søknad from '@/types/Søknad';
import { Personalia } from '@/types/Personalia';
import { Tiltak } from '@/types/Tiltak';
import toSøknadJson from '@/utils/toSøknadJson';
import SøknadResponse, { SøknadUtenEndringerResponse } from '@/types/SøknadResponse';

export function lagFormDataForInnsending(søknad: Søknad, personalia: Personalia, valgtTiltak: Tiltak): FormData {
    const søknadJson = toSøknadJson(søknad.svar, personalia.barn, valgtTiltak);
    const formData = new FormData();
    formData.append('søknad', søknadJson as string);
    const { søkerOmBarnetillegg, manueltRegistrerteBarnSøktBarnetilleggFor } = søknad.svar.barnetillegg;
    søknad.vedlegg
        .filter(
            (v) =>
                søkerOmBarnetillegg &&
                manueltRegistrerteBarnSøktBarnetilleggFor.find((elem) => elem.uuid === v.uuid) != undefined,
        )
        .forEach((vedlegg, index) => {
            formData.append(`vedlegg-${index}`, vedlegg.file);
        });
    return formData;
}

export function postSøknadMultipart(formData: FormData) {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
    const url = `${basePath}/api/soknad`;
    return fetch(url, {
        method: 'POST',
        body: formData,
    });
}

export type Innsendingsresultat =
    { type: 'mottatt'; innsendingstidspunkt: string } | { type: 'utenEndringer'; mottatt: string } | { type: 'feil' };

export async function tolkInnsendingssvar(response: Response): Promise<Innsendingsresultat> {
    if (response.status === 201) {
        const { innsendingTidspunkt }: SøknadResponse = await response.json();
        return { type: 'mottatt', innsendingstidspunkt: innsendingTidspunkt };
    }
    if (response.status === 409) {
        const body: Partial<SøknadUtenEndringerResponse> = await response.json().catch(() => ({}));
        if (body.kode === 'SØKNAD_UTEN_ENDRINGER' && body.mottatt) {
            return { type: 'utenEndringer', mottatt: body.mottatt };
        }
    }
    return { type: 'feil' };
}
