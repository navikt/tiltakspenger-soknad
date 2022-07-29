import { BrukerRegistrertBarn } from "../features/soknad/barnetillegg/BarnetilleggSkjema";
import { getAlder } from "../features/soknad/barnetillegg/common";
import { toDateString } from "../components/dateUtil";
import {
  AnnetTiltakFaktumProperties,
  BrukerRegistertBarnFaktumProperties,
  FaktaKey,
  Faktum,
  FaktumProperties,
  UtbetalerFaktumProperties,
} from "./FaktumTypes";

const faktaAPIUrl = "/api/fakta";
const getFaktaUrl = (soknadId: string) => `/api/soknad/${soknadId}/fakta`;

export const getFakta = (soknadId: string): Promise<Faktum[]> => {
  return fetch(getFaktaUrl(soknadId)).then(
    (res) => res.json() as Promise<Faktum[]>
  );
};

type CreateFaktaPayload = { behandlingsId: string } & (
  | {
      key: "barn";
      properties: BrukerRegistertBarnFaktumProperties;
    }
  | {
      key: "barntiltaksliste.annetTiltak";
      properties: AnnetTiltakFaktumProperties;
    }
  | {
      key: "trygdogpensjon.utbetalere";
      properties: UtbetalerFaktumProperties;
    }
);

const createFakta = (payload: CreateFaktaPayload, soknadsId: string) => {
  return fetch(`${faktaAPIUrl}?behandlingsId=${soknadsId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

export const deleteFakta = (faktumId: number) => {
  return fetch(`${faktaAPIUrl}/${faktumId}`, {
    method: "DELETE",
  });
};

export const postBarn = (barn: BrukerRegistrertBarn, soknadId: string) => {
  return createFakta(
    {
      key: "barn",
      behandlingsId: soknadId,
      properties: {
        alder: getAlder(barn.fodselsdato),
        etternavn: barn.etternavn,
        fodselsdato:
          typeof barn.fodselsdato === "string"
            ? barn.fodselsdato
            : toDateString(barn.fodselsdato),
        fornavn: barn.fornavn,
        land: barn.land,
        sokerbarnetillegg: null,
      },
    },
    soknadId
  );
};
