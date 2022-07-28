import { useEffect, useState } from "react";
import { useSoknadId } from "../components/useSoknadId";
import { Faktum, fetchFakta } from "./fakta";
import { BarnType } from "../features/soknad/barnetillegg/BarnetilleggSkjema";

export const useFakta = () => {
  const [fakta, setFakta] = useState<Faktum[]>([]);
  const soknadId = useSoknadId();

  useEffect(() => {
    if (!soknadId) return;
    fetchFakta(soknadId).then((fakta) => {
      setFakta(fakta);
    });
  }, []);

  return fakta;
};

export const useBarn = () => {
  const fakta = useFakta();
  const barn = fakta
    .filter((fakta) => fakta.key === "barn")
    .map((barnFakta) => barnFakta.properties as unknown as BarnType);
  return barn;
};
