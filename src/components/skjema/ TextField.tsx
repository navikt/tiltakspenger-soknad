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
import { useI18n } from "../../i18n/i18n";
import { getFieldError } from "./getFieldError";
import { BaseField } from "./Skjema";

export interface TextFieldType<T extends string> extends BaseField<T> {
  type: "text";
  inputType?: InputType;
}

interface ExposedProps extends SelfRegisterProps {
  type?: InputType | undefined;
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
}) => {
  const t = useI18n();
  const { errors } = useFormState({ name });
  const error = getFieldError(name, errors);

  if (!shouldRender) {
    return null;
  }

  const widthStyle = type === "number" ? "w-42" : "flex-1";

  return (
    <div className={`mb-8 flex`}>
      <DSTextField
        className={widthStyle}
        {...register(name, validator)}
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

const Wrapper = ({ name, label, requireFields, type }: ExposedProps) => {
  const { watch, register } = useFormContext();

  const shouldRender = useRequiredFields(watch, requireFields);
  return (
    <MemoedTextField
      name={name}
      label={label}
      shouldRender={shouldRender}
      register={register}
      type={type}
    />
  );
};

const validator = {
  required: "Field is required",
};

export default Wrapper;
