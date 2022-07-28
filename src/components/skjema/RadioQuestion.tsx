import React, {
  ForwardedRef,
  forwardRef,
  HTMLProps,
  ReactElement,
  ReactNode,
} from "react";
import { useI18n } from "../../i18n/i18n";
import { useFormContext } from "react-hook-form";
import { SelfRegisterProps } from "./requires";
import { RegisterOptions } from "react-hook-form/dist/types/validator";
import { getFieldError } from "./getFieldError";

export interface RadioOption {
  value: string | number;
  label: string;
}

interface Props extends SelfRegisterProps {
  errorKey: string;
  options: RadioOption[];
}

const RadioQuestion = ({ name, errorKey, options }: Props) => {
  const t = useI18n();
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = getFieldError(name, errors);

  return (
    <RadioGroup error={error?.message}>
      {options.map(({ value, label }, i) => (
        <Radio
          key={i}
          {...register(name, validator(t(errorKey)))}
          value={value}
        >
          {t(label)}
        </Radio>
      ))}
    </RadioGroup>
  );
};

const RadioGroup = ({
  legend,
  children,
  error,
}: {
  legend?: string;
  children: ReactElement[];
  error: string | undefined;
}) => {
  const navFieldsetStyle =
    "navds-radio-group navds-radio-group--medium navds-fieldset navds-fieldset--medium ";
  return (
    <fieldset className={navFieldsetStyle}>
      <legend>{legend}</legend>
      <div className="navds-radio-buttons ">{children}</div>
      {error ? (
        <span className="navds-error-message navds-label">{error}</span>
      ) : null}
    </fieldset>
  );
};

type RadioProps = HTMLProps<HTMLInputElement> & {
  children: ReactNode;
};

/* Radio component from Design-system does not seem to work properly with ref
 * , reuses some of the css */
const RadioWithoutForwardRef = (
  props: RadioProps,
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

const Radio = forwardRef(RadioWithoutForwardRef);

const validator: (errorKey: string) => RegisterOptions = (errorKey) => ({
  required: errorKey,
});

export default RadioQuestion;
