import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import Periodevelger from "@/components/datovelger/Periodevelger";

interface PeriodespørsmålProps {
  name: string;
  children: string;
}

export default function Periodespørsmål({
  name,
  children,
}: PeriodespørsmålProps) {
  const { control } = useFormContext();
  return (
    <fieldset>
      <legend>{children}</legend>
      <Controller
        name={name}
        control={control}
        defaultValue={{ fra: "", til: "" }}
        render={({ field: { value, onChange } }) => (
          <Periodevelger
            fromDate={value.fra}
            toDate={value.til}
            onRangeChange={(periode) => {
              if (periode) {
                const { from: fra, to: til } = periode;
                onChange({ fra, til });
              }
            }}
          />
        )}
      />
    </fieldset>
  );
}
