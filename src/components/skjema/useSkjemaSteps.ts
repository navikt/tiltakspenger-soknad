import { useRouter } from "next/router";
import { useMemo } from "react";
import { soknadBasePath } from "../../routing";
import { Step, Steps } from "../useHeaderSteps";

export const useSkjemaSteps = (): Steps<SkjemaStepName> => {
  const router = useRouter();
  const soknadId = router.query.soknadId as string;

  const tabs = useMemo(() => {
    return getTabs(soknadBasePath(soknadId));
  }, [soknadId]);

  const currentStep = tabs.find((tab) => tab.path === router.asPath)!!;
  const nextStep =
    currentStep && currentStep.index !== tabs.length - 1
      ? tabs[currentStep.index + 1]
      : undefined;

  return {
    steps: tabs,
    currentStep,
    nextStep,
  };
};

const withIndex = (array: Omit<Step<SkjemaStepName>, "index">[]) =>
  array.map((item, index) => ({ ...item, index }));

export type SkjemaStepName =
  | "Tiltak"
  | "Andre utbetalinger"
  | "Barnetillegg"
  | "Personalia"
  | "Tilleggsopplysninger";

const getTabs: (basePath: string) => Step<SkjemaStepName>[] = (basePath) =>
  withIndex([
    { name: "Tiltak", path: `${basePath}/tiltak` },
    {
      name: "Andre utbetalinger",

      path: `${basePath}/utbetalinger`,
    },
    {
      name: "Barnetillegg",

      path: `${basePath}/barnetillegg`,
    },
    { name: "Personalia", path: `${basePath}/personalia` },
    {
      name: "Tilleggsopplysninger",

      path: `${basePath}/tilleggsopplysninger`,
    },
  ]);
