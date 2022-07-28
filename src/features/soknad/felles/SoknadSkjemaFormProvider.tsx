import SoknadSkjemaPure, { Props } from "./SoknadSkjemaPure";
import { memo, ReactNode } from "react";
import { usePersistedForm } from "./SkjemaPersistanceProvider";
import { useI18n } from "../../../i18n/i18n";
import { NextRouter, useRouter } from "next/router";
import { useSkjemaSteps } from "../../../components/skjema/useSkjemaSteps";
import { FormProvider, useForm } from "react-hook-form";

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

const MemoSoknadSkjema = memo(SoknadSkjemaPure, areEqual);

export const SkjemaWithFormProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { formValues } = usePersistedForm();
  const t = useI18n();
  const router: NextRouter = useRouter();
  const { nextStep, currentStep } = useSkjemaSteps();
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
