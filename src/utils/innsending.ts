import Søknad from '@/types/Søknad';
import { Personalia } from '@/types/Personalia';
import { Tiltak } from '@/types/Tiltak';
import toSøknadJson from '@/utils/toSøknadJson';
import SøknadResponse from "@/types/SøknadResponse";

export function lagFormDataForInnsending(søknad: Søknad, personalia: Personalia, valgtTiltak: Tiltak): FormData {
    const søknadJson = toSøknadJson(søknad.svar, personalia.barn, valgtTiltak);
    const formData = new FormData();
    formData.append('søknad', søknadJson as string);
    søknad.vedlegg
        .filter(
            (v) =>
                søknad.svar.barnetillegg.manueltRegistrerteBarnSøktBarnetilleggFor.find(
                    (elem) => elem.uuid === v.uuid
                ) != undefined
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


const navigateToError = (router) => router.push('/feil-ved-innsending', undefined, { shallow: false });

const navigateToKvittering = (router) => router.push('/kvittering', undefined, { shallow: false });

export async function sendInnSøknad(
    router,
    søknad,
    personalia,
    valgtTiltak,
    setSøknadsinnsendingInProgress,
    setInnsendingstidspunkt,
) {
    try {
        setSøknadsinnsendingInProgress(true);
        const formData = lagFormDataForInnsending(søknad, personalia, valgtTiltak);
        const response = await postSøknadMultipart(formData);
        if (response.status !== 201) {
            setSøknadsinnsendingInProgress(false);
            return navigateToError(router);
        }
        const innsendingstidspunktFraApi = await response
            .json()
            .then((json: SøknadResponse) => json.innsendingTidspunkt);
        setSøknadsinnsendingInProgress(false);
        setInnsendingstidspunkt(innsendingstidspunktFraApi);
        return navigateToKvittering(router);
    } catch {
        setSøknadsinnsendingInProgress(false);
        return navigateToError(router);
    }
}
