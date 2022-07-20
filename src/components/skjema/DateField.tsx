import React from "react";
import { useFormContext, useFormState } from "react-hook-form";
import { useI18n } from "../../i18n/i18n";
import { SelfRegisterProps, useRequiredFields } from "./requires";
import { getFieldError } from "./getFieldError";
import { RegisterOptions } from "react-hook-form/dist/types/validator";

interface Props extends SelfRegisterProps {}

const DateField = ({ requireFields, label, name }: Props) => {
  const t = useI18n();

  const { errors } = useFormState({ name });
  const error = getFieldError(name, errors);

  const { register, watch } = useFormContext();
  const shouldRender = useRequiredFields(watch, requireFields);
  if (!shouldRender) {
    return null;
  }

  return (
    <div className="mb-8 flex flex-col w-44">
      <label className="font-bold">{t(label)}</label>
      <input
        {...register(name, dateFieldValidator)}
        className={`p-4 mt-2 border border-black  rounded ${
          error ? "border-red-600 border-2" : ""
        }`}
        type="date"
      />
      {error ? (
        <ul>
          <li className="list-disc p-1 ml-5 text-red-700 mt-2">
            {error?.message}
          </li>
        </ul>
      ) : null}
    </div>
  );
};

const validDate = (v: any): boolean =>
  v instanceof Date && !isNaN(v as unknown as number);

export const dateFieldValidator: RegisterOptions = {
  required: "This is required",
  valueAsDate: true,
  validate: {
    check: (value) => {
      if (!validDate(value)) return "En dato må velges";
      return undefined;
    },
  },
};

export default DateField;
