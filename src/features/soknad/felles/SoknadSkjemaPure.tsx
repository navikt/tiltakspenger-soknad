import { FC, ReactNode, useCallback } from "react";
import { useSkjemaSteps } from "../../../components/skjema/useSkjemaSteps";
import {
  SubmitErrorHandler,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";
import {
  clearFormValues,
  getFormValues,
  setFormValues,
} from "../../../components/skjema/formPersistance";
import { startRoute } from "../../../components/useRoutes";
import Header from "../../../components/Header";
import SideTabs from "./SideTabs";
import { Button } from "@navikt/ds-react";
import FooterButtons from "../../../components/FooterButtons";
import { NextRouter } from "next/router";

export interface Props {
  children: ReactNode;
  router: NextRouter;
  methods: UseFormReturn;
  nextStep: { path: string } | undefined;
  t: (t: string) => string;
}

const SoknadSkjemaPure: FC<Props> = ({
  children,
  t,
  router,
  nextStep,
  methods,
}) => {
  const { currentStep } = useSkjemaSteps();

  const onSubmit: SubmitHandler<Record<string, string>> = useCallback(
    (values, event) => {
      event?.preventDefault();
      console.log("=== formState ===");
      console.log("fields", values);
      const existingFormValues = getFormValues();
      setFormValues({ ...existingFormValues, [currentStep.name]: values });
      nextForm();
    },
    [methods.handleSubmit]
  );

  const onError: SubmitErrorHandler<any> = useCallback((errors) => {
    console.log("==== ERROR ====");
    console.log(errors);
  }, []);

  const nextForm = async () => {
    if (!nextStep) {
      console.log(getFormValues());
      return;
    }
    await router.push(nextStep.path);
  };

  const deleteSoknad = () => {
    clearFormValues();
    router.push(startRoute);
  };

  return (
    <div>
      <Header />
      <div className="bg-white flex justify-center border-y border-gray-300">
        <div className="mt-8 mr-8 border-r border-slate-400">
          <SideTabs />
          <div className="flex m-4 justify-center">
            <Button
              variant="secondary"
              onClick={methods.handleSubmit(onSubmit, onError)}
            >
              {t("skjema.ferdig")}
            </Button>
          </div>
        </div>
        <form
          className="max-w-2xl w-2xl p-8"
          onSubmit={methods.handleSubmit(onSubmit, onError)}
        >
          {children}
          <FooterButtons submit />
        </form>
      </div>
      <div className="p-8 bg-gray-200 border-t flex justify-center border border-gray-300 sticky bottom-0">
        <div className="space-x-4 max-w-2xl">
          <Button variant="tertiary">{t("fortsettSenere")}</Button>
          <Button onClick={deleteSoknad} variant="tertiary">
            {t("avbryt.slett")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SoknadSkjemaPure;
