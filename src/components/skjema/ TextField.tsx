import React, { FC, memo } from "react";

import { TextField as DSTextField } from "@navikt/ds-react";
import { useFormContext, UseFormRegister } from "react-hook-form";
import { SelfRegisterProps, useRequiredFields } from "./requires";
import { useI18n } from "../../i18n/i18n";

interface ExposedProps extends SelfRegisterProps {}

interface InternalProps extends ExposedProps {
  register: UseFormRegister<any>;
  shouldRender: boolean;
}

const TextField: FC<InternalProps> = ({
  label,
  name,
  shouldRender,
  register,
}) => {
  const t = useI18n();

  if (!shouldRender) {
    return null;
  }

  return (
    <div className="mb-8">
      <DSTextField {...register(name)} label={t(label)} size="medium" />
    </div>
  );
};

const propsAreEqual = (prevProps: InternalProps, nextProps: InternalProps) => {
  if (
    prevProps.name !== nextProps.name ||
    prevProps.label !== prevProps.label
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

const Wrapper = ({ name, label, requireFields }: ExposedProps) => {
  const { watch, register } = useFormContext();
  const shouldRender = useRequiredFields(watch, requireFields);
  return (
    <MemoedTextField
      name={name}
      label={label}
      shouldRender={shouldRender}
      register={register}
    />
  );
};

export default Wrapper;
