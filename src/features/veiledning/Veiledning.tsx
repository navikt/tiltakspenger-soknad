import { useI18n } from "../../i18n/i18n";
import { VedledningsSporsmal } from "./VedledningsSporsmal";
import Header from "../../components/Header";

import {
  useForm,
  FormProvider,
  SubmitHandler,
  SubmitErrorHandler,
} from "react-hook-form";
import { useRoutes } from "../../components/useRoutes";
import FooterButtons from "../../components/FooterButtons";
import { useRouter } from "next/router";
import {
  getFormValues,
  setFormValues,
} from "../../components/skjema/formPersistance";
import { toDateString } from "../../components/dateUtil";

const formSectionName = "veiledning";

export interface VeiledningFormValues {
  inst: boolean;
  intro: boolean;
  introDates?: { fra: string | null; til: string | null };
  kvp: boolean;
}

const convertDates = (values: VeiledningFormValues) => {
  return {
    ...values,
    introDates: values?.introDates
      ? {
          fra: values.introDates?.fra
            ? toDateString(new Date(values.introDates.fra))
            : null,
          til: values.introDates?.til
            ? toDateString(new Date(values.introDates.til))
            : null,
        }
      : undefined,
  };
};

export const Veiledning = () => {
  const t = useI18n();
  const router = useRouter();
  const {
    skjema: { tiltak },
  } = useRoutes();

  const formValues = getFormValues();
  const form = useForm({
    defaultValues:
      formValues[formSectionName] !== undefined
        ? convertDates(formValues[formSectionName])
        : undefined,
  });

  const onSubmit: SubmitHandler<VeiledningFormValues> = (values, e) => {
    e?.preventDefault();
    setFormValues({ ...formValues, [formSectionName]: values });
    router.push(tiltak);
  };
  const onError: SubmitErrorHandler<VeiledningFormValues> = () => {};

  return (
    <form onSubmit={form.handleSubmit(onSubmit, onError)}>
      <Header />
      <div>
        <div className="bg-white p-8 flex justify-center">
          <div className="max-w-2xl">
            <h2 className="font-bold text-2xl text-center mb-8">
              {t("informasjonsside.tittel")}
            </h2>
            <h3 className="font-bold text-xl mb-2">
              {t("informasjonsside.kvalifiseringsprogram.tittel")}
            </h3>
            <div>{t("informasjonsside.kvalifiseringsprogram.informasjon")}</div>
            <FormProvider {...form}>
              <VedledningsSporsmal />
            </FormProvider>
            <FooterButtons submit />
          </div>
        </div>
      </div>
    </form>
  );
};

export default Veiledning;
