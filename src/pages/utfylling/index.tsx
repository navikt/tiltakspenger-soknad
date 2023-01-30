import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import JaNeiSpørsmål from "@/components/ja-nei-spørsmål/JaNeiSpørsmål";
import Flervalgsspørsmål from "@/components/flervalgsspørsmål/Flervalgsspørsmål";
import {
  GuidePanel,
  UNSAFE_DatePicker,
  UNSAFE_useRangeDatepicker,
} from "@navikt/ds-react";

export default function Utfylling() {
  const formMethods = useForm();
  const { handleSubmit, watch, control } = formMethods;
  const watchBorPåInstitusjon = watch("borPåInstitusjon");
  const onSubmit = console.log;
  const { datepickerProps, toInputProps, fromInputProps } =
    UNSAFE_useRangeDatepicker({});

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

        <Controller
          control={control}
          defaultValue={{ fra: "", til: "" }}
          render={({ field: { onChange, value } }) => (
            <UNSAFE_DatePicker
              {...datepickerProps}
              onSelect={(periode: any) => {
                onChange({ fra: periode.from || "", til: periode.til || "" });
              }}
            >
              <div className="flex flex-wrap justify-center gap-4">
                <UNSAFE_DatePicker.Input
                  {...fromInputProps}
                  label="Fra"
                  value={value.fra}
                  onChange={(fra) => {
                    onChange({ fra, til: value.til });
                  }}
                />
                <UNSAFE_DatePicker.Input
                  {...toInputProps}
                  label="Til"
                  value={value.til}
                  onChange={(til) => onChange({ til, fra: value.fra })}
                />
              </div>
            </UNSAFE_DatePicker>
          )}
          name="tiltaksperiode"
        ></Controller>
      </form>
    </FormProvider>
  );
}
