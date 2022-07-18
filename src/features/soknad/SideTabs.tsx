import React, { useEffect, useMemo } from "react";
import { SuccessColored, WarningColored } from "@navikt/ds-icons";
import { useRouter } from "next/router";
import Link from "next/link";
import { soknadBasePath } from "../../routing";

const SideTabs = () => {
  const router = useRouter();
  const soknadId = router.query.soknadId as string;
  const isReady = router.isReady;
  const { currentStep } = useSkjemaSteps();

  useEffect(() => {
    if (isReady && !soknadId) {
      router.replace(`/soknadtiltakspenger/app/start`);
    }
  }, [soknadId, isReady]);

  const tabs = getTabs(soknadBasePath(soknadId || "empty"));

  return (
    <nav className="flex flex-col mt-[86px] mb-8">
      {tabs.map((tab, index) => (
        <Link href={tab.path} key={index}>
          <a
            className={
              "flex p-6 w-60 cursor-pointer hover:bg-stone-200 border-b first:border-t border-slate-400 text-slate-600 " +
              (index === currentStep?.index
                ? "border-l-0 border-l-blue-500 font-bold bg-white relative left-[1px] bg-white "
                : "bg-stone-100")
            }
          >
            {tab.completed ? (
              <WarningColored className={"mr-2"} />
            ) : (
              <SuccessColored className={"mr-2"} />
            )}
            {tab.name}
          </a>
        </Link>
      ))}
    </nav>
  );
};

export const useSkjemaSteps = () => {
  const router = useRouter();
  const soknadId = router.query.soknadId as string;
  const tabs = useMemo(() => {
    return getTabs(soknadBasePath(soknadId));
  }, [soknadId]);
  const currentStep = tabs.find((tab) => tab.path === router.asPath);
  return {
    currentStep,
    nextStep:
      currentStep && currentStep.index !== tabs.length - 1
        ? tabs[currentStep.index + 1]
        : undefined,
  };
};

const withIndex = (array: any[]) =>
  array.map((item, index) => ({ ...item, index }));

const getTabs: (basePath: string) => {
  name: string;
  completed: boolean;
  path: string;
  index: number;
}[] = (basePath) =>
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

export default SideTabs;
