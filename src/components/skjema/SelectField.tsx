import React, { FC } from "react";
import { useI18n } from "../../i18n/i18n";
import { Select } from "@navikt/ds-react";
import { useFormContext } from "react-hook-form";
import {
  RequiredFields,
  SelfRegisterProps,
  useRequiredFields,
} from "./requires";
import { BaseField } from "./Skjema";

export interface SelectFieldType<T extends string> extends BaseField<T> {
  type: "select";
  options: Option[];
}

export interface Option {
  value: string;
  text: string;
}

interface Props extends SelfRegisterProps {
  options: Option[];
  label: string;
}

const SelectField: FC<Props> = ({ options, label, name, requires }) => {
  const t = useI18n();
  const { register, watch } = useFormContext();
  const shouldRender = useRequiredFields(watch, requires);

  if (!shouldRender) {
    return null;
  }

  return (
    <Select {...register(name)} className={"flex-1 mr-6 mb-8"} label={t(label)}>
      {options.map((option, i) => (
        <option key={i} value={option.value}>
          {option.text}
        </option>
      ))}
    </Select>
  );
};

export default SelectField;
