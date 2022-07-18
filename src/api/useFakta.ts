import { useEffect, useState } from "react";
import { useSoknadId } from "../components/useSoknadId";
import { fetchFakta } from "./fakta";

export const useFakta = () => {
  const [fakta, setFakta] = useState<any[]>([]);
  const soknadId = useSoknadId();

  useEffect(() => {
    if (!soknadId) return;
    fetchFakta(soknadId).then((fakta) => setFakta(fakta));
  }, []);

  return fakta;
};
