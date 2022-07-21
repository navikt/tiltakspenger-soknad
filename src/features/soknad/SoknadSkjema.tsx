import { useI18n } from "../../i18n/i18n";
import Header from "../../components/Header";
import { FC, memo, ReactNode, useCallback, useState } from "react";
import { Button } from "@navikt/ds-react";
import SideTabs from "./SideTabs";
import { NextRouter, useRouter } from "next/router";
import {
  useForm,
  FormProvider,
  SubmitHandler,
  SubmitErrorHandler,
  UseFormReturn,
} from "react-hook-form";
import FooterButtons from "../../components/FooterButtons";
import { useSkjemaSteps } from "../../components/skjema/useSkjemaSteps";
import {
  getFormValues,
  setFormValues,
} from "../../components/skjema/useFormState";

interface Props {
  children: ReactNode;
  router: NextRouter;
  methods: UseFormReturn;
  nextStep: { path: string } | undefined;
  t: (t: string) => string;
}

const SoknadSkjemaRaw: FC<Props> = ({
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
    if (!nextStep) return;
    await router.push(nextStep.path);
  };

  // TODO: Feature, indicate validated tabs

  // TODO: Keep all form values

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
      <div data-sticky>
        <div data-sist-lagret data-navtilbakelenke="ingenlenke" />
      </div>
    </div>
  );
};

const areEqual = (prevProps: Props, nextProps: Props) => {
  if (prevProps.children !== nextProps.children) {
    console.log("SoknadSKjema children are NOT equal");
    return false;
  } else if (prevProps.methods !== nextProps.methods) {
    console.log("SoknadSKjema methods are NOT equal");
    return false;
  } else if (prevProps.router !== nextProps.router) {
    console.log("SoknadSKjema push are NOT equal");
    return false;
  } else if (prevProps.nextStep !== nextProps.nextStep) {
    console.log("SoknadSKjema nextStep are NOT equal");
    console.log(prevProps.nextStep, nextProps.nextStep);
    return false;
  } else if (prevProps.t !== nextProps.t) {
    console.log("SoknadSKjema t are NOT equal");
    return false;
  }
  return true;
};

const MemoSoknadSkjema = memo(SoknadSkjemaRaw, areEqual);

const Wrapper = ({ children }: { children: ReactNode }) => {
  const t = useI18n();
  const router: NextRouter = useRouter();
  const { nextStep, currentStep } = useSkjemaSteps();
  const formValues = getFormValues();
  const methods = useForm({
    defaultValues: formValues[currentStep.name],
  });

  return (
    <FormProvider {...methods}>
      <MemoSoknadSkjema
        router={router}
        methods={methods}
        nextStep={nextStep}
        t={t}
      >
        {children}
      </MemoSoknadSkjema>
    </FormProvider>
  );
};

export const SoknadSkjema = Wrapper;
