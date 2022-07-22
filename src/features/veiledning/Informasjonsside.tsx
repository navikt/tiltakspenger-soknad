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

export const Informasjonsside = () => {
  const t = useI18n();
  const router = useRouter();
  const {
    skjema: { tiltak },
  } = useRoutes();

  const form = useForm();

  const onSubmit: SubmitHandler<any> = (values, e) => {
    e?.preventDefault();
    router.push(tiltak);
  };
  const onError: SubmitErrorHandler<any> = () => {};

  return (
    <form action="post" onSubmit={form.handleSubmit(onSubmit, onError)}>
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

export default Informasjonsside;
