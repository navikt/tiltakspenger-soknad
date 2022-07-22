import React from "react";
import { useI18n } from "../i18n/i18n";
import { Stepper } from "@navikt/ds-react";
import { useHeaderSteps } from "./useHeaderSteps";
import Link from "next/link";

interface Props {
  hideSteps?: boolean;
}

const Header = ({ hideSteps }: Props) => {
  const t = useI18n();
  const { currentStep, steps } = useHeaderSteps();
  return (
    <header>
      <h1 className={"font-bold text-center"}>
        {t("tiltakspenger.skjema.tittel")}
      </h1>
      {!hideSteps ? (
        <div className="flex justify-center">
          <div className="p-4 flex-1 max-w-2xl pt-8">
            <Stepper
              orientation={"horizontal"}
              activeStep={currentStep?.index + 1}
            >
              {steps.map((step, i) => (
                <Link href={step.path} key={i}>
                  <Stepper.Step unsafe_index={i}>
                    {t(`stegindikator.${step.name}`)}
                  </Stepper.Step>
                </Link>
              ))}
            </Stepper>
          </div>
        </div>
      ) : undefined}
    </header>
  );
};

export default Header;
