import React, { FC, memo } from "react";

import { TextField as DSTextField } from "@navikt/ds-react";
import {
  DeepRequired,
  FieldErrorsImpl,
  useFormContext,
  UseFormRegister,
  useFormState,
} from "react-hook-form";
import { SelfRegisterProps, useRequiredFields } from "./requires";
import { Translate, useI18n } from "../../i18n/i18n";
import { getFieldError } from "./getFieldError";
import { BaseField } from "./Skjema";

export interface TextFieldType<T extends string> extends BaseField<T> {
  type: "text";
  inputType?: InputType;
  errorKey?: string;
}

interface ExposedProps extends SelfRegisterProps {
  type?: InputType | undefined;
  errorKey?: string;
}

interface InternalProps extends ExposedProps {
  register: UseFormRegister<any>;
  shouldRender: boolean;
}

export type InputType = "number" | "text";

const TextField: FC<InternalProps> = ({
  label,
  name,
  shouldRender,
  register,
  type,
  errorKey,
}) => {
  const t = useI18n();
  const { errors } = useFormState({ name });
  const error = getFieldError(name, errors);

  if (!shouldRender) {
    return null;
  }

  const widthStyle = type === "number" ? "w-42" : "flex-1";

  console.log({ errorKey });

  return (
    <div className={`mb-8 flex`}>
      <DSTextField
        className={widthStyle}
        {...register(name, errorKey ? validator(t)(errorKey) : undefined)}
        label={t(label)}
        size="medium"
        error={error?.message}
        type={type}
      />
    </div>
  );
};

const propsAreEqual = (prevProps: InternalProps, nextProps: InternalProps) => {
  if (
    prevProps.name !== nextProps.name ||
    prevProps.label !== nextProps.label
  ) {
    console.log("Name or label changed");
    return false;
  } else if (prevProps.register !== nextProps.register) {
    console.log("Register is not equal");
    return false;
  } else if (prevProps.shouldRender !== nextProps.shouldRender) {
    console.log("Should render is not euqal");
    return false;
  }
  return true;
};
const MemoedTextField = memo(TextField, propsAreEqual);

const Wrapper = ({ name, label, requires, type, errorKey }: ExposedProps) => {
  const { watch, register } = useFormContext();

  const shouldRender = useRequiredFields(watch, requires);
  return (
    <MemoedTextField
      name={name}
      label={label}
      shouldRender={shouldRender}
      register={register}
      type={type}
      errorKey={errorKey}
    />
  );
};

const validator = (t: Translate) => (errorKey: string) => ({
  required: t(errorKey),
});

export default Wrapper;
