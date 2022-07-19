import { useRouter } from "next/router";
import { Routes, soknadIdParam, useRoutes } from "./useRoutes";
import { useSoknadId } from "./useSoknadId";

export const useSteps = () => {
  const router = useRouter();
  const currentPath = router.asPath || "/404";
  const soknadId = useSoknadId() || "empty";

  const routes = useRoutes();
  const steps = getSteps(routes);
  const currentStep = steps.findIndex((step) =>
    step.path.startsWith(currentPath)
  );

  const nextStep = steps[currentStep + 1];

  return {
    currentStep,
    steps,
    nextStep:
      currentStep !== -1
        ? {
            path: nextStep.path.replace(soknadIdParam, soknadId),
            index: currentStep + 1,
          }
        : undefined,
  };
};

const getSteps = (routes: Routes) => [
  { name: "veiledning", path: routes.veiledning },
  { name: "skjema", path: routes.skjema.tiltak },
  { name: "vedlegg", path: routes.vedlegg },
  { name: "sendinn", path: routes.sendinn },
];
