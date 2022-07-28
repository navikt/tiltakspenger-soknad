import {
  initialForm,
  PersistedFormValues,
} from "../../features/soknad/felles/SkjemaPersistanceProvider";

const FORM_KEY = "form";

const isServerSide = typeof window === "undefined";

export const setFormValues = (values: PersistedFormValues) => {
  if (isServerSide) return;
  localStorage.setItem(FORM_KEY, JSON.stringify(values));
};

export const getFormValues = (): PersistedFormValues => {
  if (isServerSide) return initialForm;
  return JSON.parse(localStorage.getItem(FORM_KEY) || "{}");
};

export const clearFormValues = () => {
  localStorage.setItem(FORM_KEY, "{}");
};
