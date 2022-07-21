import React from "react";
import Question, { RadioFieldType } from "../Question";
import SelectField, { SelectFieldType } from "./SelectField";
import Subfield, { SubfieldType } from "./Subfield";
import DateField, { DateFieldType } from "./DateField";
import TextField, { TextFieldType } from "./ TextField";
import { RequiredFields } from "./requires";
import FraTilField, { FraTilFieldType } from "./FraTilField";

export interface BaseField<T extends string> {
  label: string;
  name: T;
  requires?: RequiredFields;
}

export type Field<T extends string> =
  | SelectFieldType<T>
  | TextFieldType<T>
  | DateFieldType<T>
  | RadioFieldType<T>
  | SubfieldType<T>
  | FraTilFieldType<T>;

interface Props<T extends string> {
  fields: Field<T>[];
}

const Skjema = function <T extends string>({ fields }: Props<T>) {
  return (
    <>
      {fields.map((field, i) => {
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
              noWrapper={field.noWrapper || false}
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
