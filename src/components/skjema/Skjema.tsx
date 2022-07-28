import React from "react";
import Question, { BoolRadioField, MultiRadioField } from "./Question";
import SelectField, { SelectFieldType } from "./SelectField";
import Subfield, { SubfieldType } from "./Subfield";
import DateField, { DateFieldType } from "./DateField";
import TextField, { TextFieldType } from "./ TextField";
import { RequiredFields } from "./requires";
import FraTilField, { FraTilFieldType } from "./FraTilField";
import { text } from "stream/consumers";

export interface BaseField<T extends string> {
  label: string;
  name: T;
  requires?: RequiredFields;
}

export type Field<T extends string> =
  | SelectFieldType<T>
  | TextFieldType<T>
  | DateFieldType<T>
  | BoolRadioField<T>
  | MultiRadioField<T>
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
          return <SelectField {...field} key={i} />;
        }
        if (field.type === "text") {
          const { type, ...props } = field;
          const textFieldProps = { ...props, inputType: type };
          return <TextField {...textFieldProps} key={i} />;
        }
        if (field.type === "date") {
          return <DateField {...field} key={i} />;
        }
        if (field.type === "fratil") {
          return <FraTilField {...field} key={i} />;
        }
        if (field.type === "subfield") {
          return (
            <Subfield {...field} noWrapper={field.noWrapper || false} key={i}>
              <field.component>test</field.component>
            </Subfield>
          );
        }
        if (field.type === "radio-bool") {
          return <Question {...field} key={i} title={field.label} />;
        }
        if (field.type === "radio-multi") {
          return <Question {...field} key={i} title={field.label} />;
        }
      })}
    </>
  );
};

export default Skjema;
