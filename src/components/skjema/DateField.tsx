import React from "react";
import { useFormContext, useFormState } from "react-hook-form";
import { Translate, useI18n } from "../../i18n/i18n";
import { SelfRegisterProps, useRequiredFields } from "./requires";
import { getFieldError } from "./getFieldError";
import { RegisterOptions } from "react-hook-form/dist/types/validator";
import { BaseField } from "./Skjema";

export interface DateFieldType<T extends string> extends BaseField<T> {
  type: "date";
  validations?: (t: Translate) => RegisterOptions;
}

// TODO: Figure out if datefield need "validations" props and not just errorKey

interface Props extends SelfRegisterProps {
  validations?: (t: Translate) => RegisterOptions;
}

const DateField = ({ requires, label, name, validations }: Props) => {
  const t = useI18n();

  const { errors } = useFormState({ name });
  const error = getFieldError(name, errors);

  const { register, watch } = useFormContext();
  const shouldRender = useRequiredFields(watch, requires);
  if (!shouldRender) {
    return null;
  }

  return (
    <div className="mb-8 flex flex-col w-44">
      <label className="font-bold">{t(label)}</label>
      <input
        {...register(
          name,
          validations ? validations(t) : dateFieldValidator("error")(t)
        )}
        className={`p-3 mt-2 border border-black  rounded ${
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

export const dateFieldValidator: (
  errorKey: string
) => (t: Translate) => RegisterOptions = (errorKey: string) => (t) => ({
  required: t(errorKey),
  valueAsDate: true,
  validate: {
    check: (value) => {
      if (!validDate(value)) return t(errorKey);
      return undefined;
    },
  },
});

export default DateField;
