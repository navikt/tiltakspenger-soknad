import React, { ReactNode, useContext, useEffect, useState } from "react";
import { getFormValues } from "../../../components/skjema/formPersistance";
import { VeiledningFormValues } from "../../veiledning/Veiledning";
import { Loader } from "@navikt/ds-react";
import { SkjemaWithFormProvider } from "./SoknadSkjemaFormProvider";
import { useSoknadId } from "../../../components/useSoknadId";

export type PersistedFormValues = {
  Tiltak: Record<string, string | undefined | number>;
  "Andre utbetalinger": Record<string, string | undefined | number>;
  Barnetillegg: Record<string, string | undefined | number>;
  Personalia: Record<string, string | undefined | number>;
  Tilleggsopplysninger: Record<string, string | undefined | number>;
  veiledning?: VeiledningFormValues;
};

export const initialForm: PersistedFormValues = {
  "Andre utbetalinger": {},
  Tiltak: {},
  Barnetillegg: {},
  Personalia: {},
  Tilleggsopplysninger: {},
  veiledning: undefined,
};

const FormPersistContext =
  React.createContext<PersistedFormValues>(initialForm);

const SkjemaPersistanceProvider = ({ children }: { children: ReactNode }) => {
  const soknadId = useSoknadId();
  const [{ formValues, isLoaded }, setFormValues] = useState<{
    formValues: PersistedFormValues;
    isLoaded: boolean;
  }>({ isLoaded: false, formValues: initialForm });
  useEffect(() => {
    getFormValues(soknadId).then((values) => {
      setFormValues({
        formValues: values,
        isLoaded: true,
      });
    });
  }, []);

  if (!isLoaded || !formValues) return <Loader />;

  return (
    <FormPersistContext.Provider value={formValues}>
      <SkjemaWithFormProvider>{children}</SkjemaWithFormProvider>
    </FormPersistContext.Provider>
  );
};

export const usePersistedForm = () => {
  const formValues = useContext(FormPersistContext);
  return {
    formValues,
    saveForm: (values: PersistedFormValues) => {
      console.log("Saving form", values);
    },
  };
};

export default SkjemaPersistanceProvider;
