import React, { ChangeEventHandler, MouseEventHandler } from "react";
import { useI18n } from "../i18n/i18n";
import RadioQuestion, { RadioOption } from "./RadioQuestion";
import { useFormContext, UseFormRegisterReturn } from "react-hook-form";
import { SelfRegisterProps, useRequiredFields } from "./skjema/requires";
import { BaseField } from "./skjema/Skjema";
import { options } from "sanitize-html";

interface CommonFieldProps {
  infoText?: string;
  errorKey: string;
  indent?: boolean;
}

export type BoolRadioField<T extends string> = {
  type: "radio-bool";
  trueTextKey: string;
  falseTextKey: string;
} & CommonFieldProps &
  BaseField<T>;

export type MultiRadioField<T extends string> = {
  type: "radio-multi";
  options: RadioOption[];
} & CommonFieldProps &
  BaseField<T>;

interface Props extends SelfRegisterProps {
  title: string;
  infoTextKey?: string;
  errorKey: string;
  indent?: boolean;
}

interface TrueFalseQuestionProps extends Props {
  trueTextKey: string;
  falseTextKey: string;
}

interface OptionProps {
  options: RadioOption[];
}

type MultiAltQuestionProps = OptionProps & Props;

const Question = ({
  title,
  infoTextKey,
  label,
  requireFields,
  name,
  errorKey,
  indent,
  ...props
}: TrueFalseQuestionProps | MultiAltQuestionProps) => {
  const t = useI18n();
  const { watch } = useFormContext();
  const shouldRender = useRequiredFields(watch, requireFields);
  if (!shouldRender) return null;

  const options = getOptions(props);

  return (
    <div className={"my-8 " + (indent ? "pl-6 border-l border-l-4" : "")}>
      <h3 className={"font-bold text-xl"}>{t(title)}</h3>
      {infoTextKey ? <div className="mt-4">{t(infoTextKey)}</div> : undefined}
      <RadioQuestion
        options={options}
        name={name}
        label={label}
        requireFields={requireFields}
        errorKey={errorKey}
      />
    </div>
  );
};

const getOptions = (
  props: { trueTextKey: string; falseTextKey: string } | OptionProps
): RadioOption[] => {
  if (hasOptions(props)) return props.options;
  return [
    { value: "true", label: props.trueTextKey },
    { value: "false", label: props.falseTextKey },
  ];
};

const hasOptions = (props: {}): props is OptionProps =>
  props.hasOwnProperty("options");

export default Question;
