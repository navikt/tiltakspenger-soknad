import { useRouter } from "next/router";
import { Routes, useRoutes } from "./useRoutes";

export interface Step {
  index: number;
  path: string;
  name: string;
}

export interface Steps {
  currentStep: Step;
  nextStep?: Step;
  steps: Step[];
}

export const useHeaderSteps = (): Steps => {
  const router = useRouter();
  const currentPath = router.asPath || "/404";

  const routes = useRoutes();
  const steps = getSteps(routes);
  const currentStepIndex = steps.findIndex((step) => {
    if (step.index === 1) {
      return currentPath.startsWith(step.path.replace("/tiltak", ""));
    }
    return step.path === currentPath;
  });

  return {
    currentStep: steps[currentStepIndex],
    steps,
    nextStep: currentStepIndex !== -1 ? steps[currentStepIndex + 1] : undefined,
  };
};

const getSteps = (routes: Routes): Step[] => [
  { name: "veiledning", path: routes.veiledning, index: 0 },
  { name: "skjema", path: routes.skjema.tiltak, index: 1 },
  { name: "vedlegg", path: routes.vedlegg, index: 2 },
  { name: "sendInn", path: routes.sendinn, index: 3 },
];
