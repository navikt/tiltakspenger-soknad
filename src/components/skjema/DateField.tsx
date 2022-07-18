import React from "react";
import { useFormContext } from "react-hook-form";
import { useI18n } from "../../i18n/i18n";
import { SelfRegisterProps, useRequiredFields } from "./requires";

interface Props extends SelfRegisterProps {}

const DateField = ({ requireFields, label, name }: Props) => {
  const t = useI18n();

  if (name == "til") {
    console.log("Render DateField");
  }

  const { register, watch } = useFormContext();
  const shouldRender = useRequiredFields(watch, requireFields);
  if (!shouldRender) {
    return null;
  }

  return (
    <div className="my-4 mb-8 flex flex-col w-1/2">
      <label className="font-bold">{t(label)}</label>
      <input
        {...register(name, dateFieldValidator)}
        className="p-4 mt-2 border border-black"
        type="date"
      />
    </div>
  );
};

export const dateFieldValidator = {
  required: "This is required",
  valueAsDate: true,
};

export default DateField;
