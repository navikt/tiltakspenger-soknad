import React, { ChangeEventHandler, MouseEventHandler } from "react";
import { useI18n } from "../i18n/i18n";
import RadioQuestion from "./RadioQuestion";
import { useFormContext, UseFormRegisterReturn } from "react-hook-form";
import { SelfRegisterProps, useRequiredFields } from "./skjema/requires";

interface Props extends SelfRegisterProps {
  title: string;
  infoTextKey?: string;
  trueTextKey: string;
  falseTextKey: string;
  errorKey: string;
  indent?: boolean;
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
  indent,
}: Props) => {
  const t = useI18n();
  const { watch } = useFormContext();
  const shouldRender = useRequiredFields(watch, requireFields);
  if (!shouldRender) return null;

  return (
    <div className={"my-8 " + (indent ? "pl-6 border-l border-l-4" : "")}>
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
