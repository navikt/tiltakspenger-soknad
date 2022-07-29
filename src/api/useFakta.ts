import { useEffect, useState } from "react";
import { useSoknadId } from "../components/useSoknadId";
import { Faktum, getFakta } from "./fakta";
import { BarnType } from "../features/soknad/barnetillegg/BarnetilleggSkjema";

export const useFakta = () => {
  const [fakta, setFakta] = useState<Faktum[]>([]);
  const soknadId = useSoknadId();

  useEffect(() => {
    if (!soknadId) return;
    getFakta(soknadId).then((fakta) => {
      setFakta(fakta);
    });
  }, []);

  return fakta;
};

export const getBarn = (fakta: Faktum[]) =>
  fakta
    .filter((fakta) => fakta.key === "barn")
    .map((barnFakta) => ({
      ...(barnFakta.properties as unknown as BarnType),
      faktumId: barnFakta.faktumId,
    }));

export const useBarn = () => {
  const fakta = useFakta();
  return getBarn(fakta);
};
