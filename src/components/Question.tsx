import React, { ChangeEventHandler, MouseEventHandler } from "react";
import { useI18n } from "../i18n/i18n";
import RadioQuestion from "./RadioQuestion";
import { UseFormRegisterReturn } from "react-hook-form";
import { SelfRegisterProps } from "./skjema/requires";

interface Props extends SelfRegisterProps {
  title: string;
  infoTextKey?: string;
  trueTextKey: string;
  falseTextKey: string;
  errorKey: string;
}

const Question = ({
  title,
  trueTextKey,
  falseTextKey,
  infoTextKey,
  label,
  requireFields,
  name,
  errorKey,
}: Props) => {
  const t = useI18n();

  return (
    <div className="my-8">
      <h3 className={"font-bold text-xl"}>{t(title)}</h3>
      {infoTextKey ? <div className="mt-4">{t(infoTextKey)}</div> : undefined}
      <RadioQuestion
        name={name}
        label={label}
        requireFields={requireFields}
        trueKey={trueTextKey}
        falseKey={falseTextKey}
        errorKey={errorKey}
      />
    </div>
  );
};

export default Question;
