import Søknad from '@/types/Søknad';
import { Personalia } from '@/types/Personalia';
import { Tiltak } from '@/types/Tiltak';
import toSøknadJson from '@/utils/toSøknadJson';
import SøknadResponse from "@/types/SøknadResponse";
import Router, {BaseRouter} from "next/dist/shared/lib/router/router";

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

type RouterType = BaseRouter & Pick<Router, "push" | "replace" | "reload" | "back" | "forward" | "prefetch" | "beforePopState" | "events" | "isFallback" | "isReady" | "isPreview">;

const navigateToError = (router: RouterType) => router.push('/feil-ved-innsending', undefined, { shallow: false });

const navigateToKvittering = (router: RouterType) => router.push('/kvittering', undefined, { shallow: false });

export async function sendInnSøknad(
    router: RouterType,
    søknad: Søknad,
    personalia: Personalia,
    valgtTiltak: Tiltak,
    setSøknadsinnsendingInProgress: (value: boolean) => void,
    setInnsendingstidspunkt: (value: string) => void,
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
