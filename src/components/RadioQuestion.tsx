import React, {
  ForwardedRef,
  forwardRef,
  HTMLProps,
  ReactElement,
  ReactNode,
} from "react";
import { useI18n } from "../i18n/i18n";
import { useFormContext } from "react-hook-form";
import { SelfRegisterProps, useRequiredFields } from "./skjema/requires";
import { RegisterOptions } from "react-hook-form/dist/types/validator";

interface Props extends SelfRegisterProps {
  trueKey: string;
  falseKey: string;
}

const RadioQuestion = ({ trueKey, falseKey, name, requireFields }: Props) => {
  const t = useI18n();

  const { register, watch } = useFormContext();
  const shouldRender = useRequiredFields(watch, requireFields);
  if (!shouldRender) {
    return null;
  }

  return (
    <RadioGroupB legend={"test legend"}>
      <RadioB {...register(name, validator)} value={"true"}>
        {t(trueKey)}
      </RadioB>
      <RadioB {...register(name, validator)} value={"false"}>
        {t(falseKey)}
      </RadioB>
    </RadioGroupB>
  );
};

const RadioGroupB = ({
  legend,
  children,
}: {
  legend: string;
  children: ReactElement[];
}) => {
  return (
    <fieldset className="navds-radio-group navds-radio-group--medium navds-fieldset navds-fieldset--medium">
      <legend>{legend}</legend>
      <div className="navds-radio-buttons">{children}</div>
    </fieldset>
  );
};

type RadioBProps = HTMLProps<HTMLInputElement> & {
  children: ReactNode;
  value: string;
};

const RadioBWithoutForwardRef = (
  props: RadioBProps,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const { children, ...restProps } = props;
  const id = `${restProps.name}_${restProps.value}`;
  return (
    <div className="navds-radio navds-radio--medium">
      <input
        type="radio"
        id={id}
        ref={ref}
        {...restProps}
        value={restProps.value}
        className="navds-radio__input"
      />
      <label htmlFor={id} className="navds-radio__label">
        <div className="navds-radio__content">{children}</div>
      </label>
    </div>
  );
};

const RadioB = forwardRef(RadioBWithoutForwardRef);

const validator: RegisterOptions = {};

export default RadioQuestion;
