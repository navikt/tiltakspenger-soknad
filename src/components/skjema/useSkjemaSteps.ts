import { useRouter } from "next/router";
import { useMemo } from "react";
import { soknadBasePath } from "../../routing";
import { Step, Steps } from "../useHeaderSteps";

export const useSkjemaSteps = (): Steps => {
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

const withIndex = (array: any[]) =>
  array.map((item, index) => ({ ...item, index }));

const getTabs: (basePath: string) => Tab[] = (basePath) =>
  withIndex([
    { name: "Tiltak", completed: false, path: `${basePath}/tiltak` },
    {
      name: "Andre utbetalinger",
      completed: false,
      path: `${basePath}/utbetalinger`,
    },
    {
      name: "Barnetillegg",
      completed: false,
      path: `${basePath}/barnetillegg`,
    },
    { name: "Personalia", completed: false, path: `${basePath}/personalia` },
    {
      name: "Tilleggsopplysninger",
      completed: false,
      path: `${basePath}/tilleggsopplysninger`,
    },
  ]);
