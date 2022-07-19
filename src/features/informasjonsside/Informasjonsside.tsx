import { useI18n } from "../../i18n/i18n";
import { VedledningsSporsmal } from "./VedledningsSporsmal";
import Header from "../../components/Header";

import {
  useForm,
  FormProvider,
  SubmitHandler,
  SubmitErrorHandler,
} from "react-hook-form";
import { Button } from "@navikt/ds-react";
import Link from "next/link";
import { useRoutes } from "../../components/useRoutes";

export const Informasjonsside = () => {
  const t = useI18n();
  const {
    skjema: { tiltak },
  } = useRoutes();

  const form = useForm();

  const onSubmit: SubmitHandler<any> = (values, e) => {
    e.preventDefault();
  };
  const onError: SubmitErrorHandler<any> = () => {};

  return (
    <form action="post" onSubmit={form.handleSubmit(onSubmit, onError)}>
      <Header />
      <div className="side-innhold" data-sidetittel="global.sidetittel">
        <div className="bg-white p-8 flex justify-center">
          <div className="max-w-2xl">
            <div data-feilliste />
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
            <div className="border-t pt-4 border-gray-400 flex items-start">
              <Link href={tiltak}>
                <Button as={"a"}>{t("neste")}</Button>
              </Link>
              <Button onClick={() => {}} variant="tertiary">
                Avbryt
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Informasjonsside;
