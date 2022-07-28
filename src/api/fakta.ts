const faktaAPIUrl = "/api/fakta";

export interface Faktum {
  properties: Record<string, string | number | null>;
  faktumEgenskaper: any[];
  faktumId: number;
  key: string;
  parrentFaktum: number | null;
  soknadId: number;
  type: "BRUKERREGISTRERT" | "SYSTEMREGISTRERT";
}

export const fetchFakta = (soknadId: string): Promise<Faktum[]> => {
  return fetch(faktaAPIUrl).then((res) => res.json() as Promise<Faktum[]>);
};

interface CreateFaktaPayload {
  behandlingsId: string;
  key: string;
  properties: {
    land: string;
    fodselsdato: string;
    fornavn: string;
    etternavn: string;
    alder: number;
  };
  alder: number;
  etternavn: string;
  fodselsdato: string;
  fornavn: string;
  land: string;
}

export const createFakta = (payload: CreateFaktaPayload, soknadsId: string) => {
  return fetch(`${faktaAPIUrl}?behandlingsId=${soknadsId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};
