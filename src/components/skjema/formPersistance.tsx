import {
  initialForm,
  PersistedFormValues,
} from "../../features/soknad/felles/SkjemaPersistanceProvider";
import { getFakta } from "../../api/fakta";
import { skjemaToFakta } from "../../api/skjemaToFakta";

const FORM_KEY = "form";

const isServerSide = typeof window === "undefined";

export const setFormValues = (values: PersistedFormValues) => {
  if (isServerSide) return;
  localStorage.setItem(FORM_KEY, JSON.stringify(values));
};

export const getFormValues = async (
  soknadId: string | undefined
): Promise<PersistedFormValues> => {
  if (isServerSide || !soknadId) return initialForm;
  const fakta = await getFakta(soknadId);
  return skjemaToFakta(fakta);
  return JSON.parse(localStorage.getItem(FORM_KEY) || "{}");
};

export const clearFormValues = () => {
  localStorage.setItem(FORM_KEY, "{}");
};
