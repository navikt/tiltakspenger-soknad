import React from "react";
import DateField from "./DateField";

interface Props {
  name: string;
  labelFra: string;
  labelTil: string;
}

const FraTilField = ({ name, labelFra, labelTil }: Props) => {
  return (
    <div className="flex">
      <div className="grow">
        <DateField name={`${name}.fra`} label={labelFra} />
      </div>
      <div className="grow">
        <DateField name={`${name}.til`} label={labelTil} />
      </div>
    </div>
  );
};

export default FraTilField;
