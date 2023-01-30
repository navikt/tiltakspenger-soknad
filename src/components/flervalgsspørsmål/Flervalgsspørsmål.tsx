import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { RadioGroup, Radio } from "@navikt/ds-react";

interface Svaralternativ {
  tekst: string;
  value: string;
}

interface FlervalgsspørsmålProps {
  alternativer: Svaralternativ[];
  name: string;
  children: string;
}
export default function Flervalgsspørsmål({
  name,
  alternativer,
  children,
}: FlervalgsspørsmålProps) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, name, onBlur, onChange } }) => (
        <RadioGroup
          legend={children}
          value={value || ""}
          name={name}
          onBlur={onBlur}
          onChange={onChange}
        >
          {alternativer.map((alternativ) => (
            <Radio value={alternativ.value} key={alternativ.value}>
              {alternativ.tekst}
            </Radio>
          ))}
        </RadioGroup>
      )}
    />
  );
}
