import React from "react";
import DateField from "./DateField";
import { BaseField } from "./Skjema";
import { RegisterOptions } from "react-hook-form/dist/types/validator";
import { Translate } from "../../i18n/i18n";

export type FraTilFieldType<T extends string> = Omit<BaseField<T>, "label"> & {
  type: "fratil";
  fraLabel: string;
  tilLabel: string;
  validations?: {
    fra: (t: Translate) => RegisterOptions;
    til?: (t: Translate) => RegisterOptions;
  };
};

interface Props {
  name: string;
  fraLabel: string;
  tilLabel: string;
  validations?: {
    fra?: (t: Translate) => RegisterOptions;
    til?: (t: Translate) => RegisterOptions;
  };
}

const FraTilField = ({
  name,
  tilLabel,
  fraLabel,
  validations: { fra, til } = {},
}: Props) => {
  return (
    <div className="flex">
      <div className="grow">
        <DateField name={`${name}.fra`} label={fraLabel} validations={fra} />
      </div>
      <div className="grow">
        <DateField name={`${name}.til`} label={tilLabel} validations={til} />
      </div>
    </div>
  );
};

export default FraTilField;
