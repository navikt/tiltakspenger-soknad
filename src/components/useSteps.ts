import { useRouter } from "next/router";
import { useSoknadId } from "./useSoknadId";

export const useSteps = () => {
  const router = useRouter();
  const page = router.asPath.split("/").at(4);
  const soknadId = useSoknadId();
  const baseUrl = `/soknadtiltakspenger/app/${soknadId}`;
  const currentStep = steps.findIndex((step) => step.name === page);

  return {
    currentStep,
    nextStep: currentStep + 1,
    nextUrl: `${baseUrl}/${steps[currentStep]?.name}`,
    steps,
  };
};

const steps = [
  { name: "veiledning" },
  { name: "skjema" },
  { name: "vedlegg" },
  { name: "sendinn" },
];
