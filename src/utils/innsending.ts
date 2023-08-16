import Søknad from '@/types/Søknad';
import { Personalia } from '@/types/Personalia';
import { Tiltak } from '@/types/Tiltak';
import toSøknadJson from '@/utils/toSøknadJson';

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
    const url = `${process.env.NEXT_PUBLIC_BASE_PATH}/api/soknad`;
    return fetch(url, {
        method: 'POST',
        body: formData,
    });
}
