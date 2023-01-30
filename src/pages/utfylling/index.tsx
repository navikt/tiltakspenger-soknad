import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import JaNeiSpørsmål from "@/components/ja-nei-spørsmål/JaNeiSpørsmål";

export default function Utfylling() {
  const formMethods = useForm();
  const { handleSubmit } = formMethods;
  const onSubmit = console.log;
  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <JaNeiSpørsmål name="deltarIKvp">
          Deltar du i kvalifiseringsprogrammet?
        </JaNeiSpørsmål>
      </form>
    </FormProvider>
  );
}
