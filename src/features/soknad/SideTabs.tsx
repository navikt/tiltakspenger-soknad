import React, { useEffect, useMemo } from "react";
import { FillForms, SuccessColored, WarningColored } from "@navikt/ds-icons";
import { useRouter } from "next/router";
import Link from "next/link";
import { soknadBasePath } from "../../routing";
import { useSkjemaSteps } from "../../components/skjema/useSkjemaSteps";
import { getFormValues } from "../../components/skjema/useFormState";

const SideTabs = () => {
  const router = useRouter();
  const soknadId = router.query.soknadId as string;
  const isReady = router.isReady;
  const { currentStep, steps } = useSkjemaSteps();

  const formValues = getFormValues();
  const isCompleted = (stepName: string) => !!formValues[stepName];

  useEffect(() => {
    if (isReady && !soknadId) {
      router.replace(`/soknadtiltakspenger/app/start`);
    }
  }, [soknadId, isReady]);

  return (
    <nav className="flex flex-col mt-[86px] mb-8">
      {steps.map((tab, index) => (
        <Link href={tab.path} key={index}>
          <a
            className={
              "flex p-6 w-60 cursor-pointer hover:bg-stone-200 border-b first:border-t border-slate-400 text-slate-600 " +
              (index === currentStep?.index
                ? "border-l-0 border-l-blue-500 font-bold bg-white relative left-[1px] bg-white "
                : "bg-stone-100")
            }
          >
            {isCompleted(tab.name) ? (
              <SuccessColored className={"mr-2"} />
            ) : (
              <FillForms className={"mr-2"} />
            )}
            {tab.name}
          </a>
        </Link>
      ))}
    </nav>
  );
};

export default SideTabs;
