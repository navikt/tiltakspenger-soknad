const FORM_KEY = "form";

type FormValues = Record<string, any>;

const isServerSide = typeof window === "undefined";

export const setFormValues = (values: FormValues) => {
  if (isServerSide) return;
  localStorage.setItem(FORM_KEY, JSON.stringify(values));
};

export const getFormValues = (): FormValues => {
  if (isServerSide) return {};
  return JSON.parse(localStorage.getItem(FORM_KEY) || "{}");
};
