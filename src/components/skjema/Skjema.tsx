import React from "react";
import Question from "../Question";
import SelectField, { Option } from "./SelectField";
import Subfield from "./Subfield";
import DateField from "./DateField";
import TextField, { InputType } from "./ TextField";
import { RequiredFields } from "./requires";
import FraTilField from "./FraTilField";

interface BaseField<T extends string> {
  label: string;
  name: T;
  requires?: RequiredFields;
}

interface SelectField<T extends string> extends BaseField<T> {
  type: "select";
  options: Option[];
}
interface TextField<T extends string> extends BaseField<T> {
  type: "text";
  inputType?: InputType;
}
interface DateField<T extends string> extends BaseField<T> {
  type: "date";
}
type FraTilField<T extends string> = Omit<BaseField<T>, "label"> & {
  type: "fratil";
  fraLabel: string;
  tilLabel: string;
};
interface RadioField<T extends string> extends BaseField<T> {
  type: "radio";
  trueTextKey: string;
  falseTextKey: string;
  infoText?: string;
  errorKey: string;
  indent?: boolean;
}
interface SubfieldType<T extends string> extends BaseField<T> {
  type: "subfield";
  noWrapper: boolean;
  component: React.FC<{ children: any }>;
}

export type Field<T extends string> =
  | SelectField<T>
  | TextField<T>
  | DateField<T>
  | RadioField<T>
  | SubfieldType<T>
  | FraTilField<T>;

interface Props<T extends string> {
  fields: Field<T>[];
}

const Skjema = function <T extends string>({ fields }: Props<T>) {
  // console.log("Render skjema");
  return (
    <>
      {fields /*
        .filter((field) => {
          if (!field.requires) return true;
          console.log(watchedFields);
          return Object.entries(field.requires).every(
            ([key, value]) => watchedFields[key as T] === value
          );
        })*/
        .map((field, i) => {
          if (field.type === "select") {
            return (
              <SelectField
                name={field.name}
                requireFields={field.requires}
                key={i}
                label={field.label}
                options={field.options}
              />
            );
          }
          if (field.type === "text") {
            return (
              <TextField
                label={field.label}
                requireFields={field.requires}
                key={i}
                name={field.name}
                type={field.inputType}
              />
            );
          }
          if (field.type === "date") {
            return <DateField name={field.name} key={i} label={field.label} />;
          }
          if (field.type === "fratil") {
            return (
              <FraTilField
                name={field.name}
                key={i}
                labelTil={field.tilLabel}
                labelFra={field.fraLabel}
              />
            );
          }
          if (field.type === "subfield") {
            return (
              <Subfield
                noWrapper={field.noWrapper}
                requireFields={field.requires}
                label={field.label}
                name={field.name}
                key={i}
              >
                <field.component>test</field.component>
              </Subfield>
            );
          }
          if (field.type === "radio") {
            return (
              <Question
                indent={field.indent}
                infoTextKey={field.infoText}
                name={field.name}
                label={field.label}
                requireFields={field.requires}
                key={i}
                title={field.label}
                trueTextKey={field.trueTextKey}
                falseTextKey={field.falseTextKey}
                errorKey={field.errorKey}
              />
            );
          }
        })}
    </>
  );
};

export default Skjema;
