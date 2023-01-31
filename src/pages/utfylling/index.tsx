import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import JaNeiSpørsmål from "@/components/ja-nei-spørsmål/JaNeiSpørsmål";
import Flervalgsspørsmål from "@/components/flervalgsspørsmål/Flervalgsspørsmål";
import { GuidePanel } from "@navikt/ds-react";
import Periodespørsmål from "@/components/periodespørsmål/Periodespørsmål";

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
        <GuidePanel poster>
          Fyll ut informasjon om tiltaket du vil delta på i feltene under. Hvis
          du ikke har avtalt tiltaket med NAV, vil vi kontakte deg for å avklare
          om vi kan godkjenne tiltaket.
        </GuidePanel>
        <Flervalgsspørsmål
          alternativer={[
            { tekst: "AMO", value: "AMO" },
            { tekst: "Arbeidstrening", value: "arbeidstrening" },
            { tekst: "Jobbsøkerkurs", value: "jobbsøkerkurs" },
            { tekst: "Annet type tiltak", value: "annet" },
          ]}
          name="tiltakstype"
        >
          Hvilken type tiltak søker du tiltakspenger for?
        </Flervalgsspørsmål>

        <Periodespørsmål name="tiltaksperiode">
          I hvilken periode skal du delta på tiltaket?
        </Periodespørsmål>
      </form>
    </FormProvider>
  );
}
