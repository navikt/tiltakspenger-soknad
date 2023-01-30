import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import JaNeiSpørsmål from "@/components/ja-nei-spørsmål/JaNeiSpørsmål";
import Flervalgsspørsmål from "@/components/flervalgsspørsmål/Flervalgsspørsmål";

export default function Utfylling() {
  const formMethods = useForm();
  const { handleSubmit, watch } = formMethods;
  const watchBorPåInstitusjon = watch("borPåInstitusjon");
  const onSubmit = console.log;

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <JaNeiSpørsmål name="deltarIKvp">
          Deltar du i kvalifiseringsprogrammet?
        </JaNeiSpørsmål>
        <JaNeiSpørsmål name="borPåInstitusjon">
          Bor du på institusjon i tiltaksperioden med fri kost og losji?
        </JaNeiSpørsmål>
        {watchBorPåInstitusjon && (
          <Flervalgsspørsmål
            name="institusjonstype"
            alternativer={[
              {
                tekst: "Barnevernsinstitusjon",
                value: "barnevernsinstitusjon",
              },
              { tekst: "Overgangsbolig", value: "overgangsbolig" },
              { tekst: "Annen type institusjon", value: "annen" },
            ]}
          >
            Hvilken type institusjon bor du på?
          </Flervalgsspørsmål>
        )}
      </form>
    </FormProvider>
  );
}
