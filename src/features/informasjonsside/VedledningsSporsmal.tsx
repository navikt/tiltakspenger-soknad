import Skjema from "../../components/skjema/Skjema";

export const VedledningsSporsmal = () => {
  return (
    <Skjema
      fields={[
        {
          type: "radio",
          name: "kvp",
          label: "informasjonsside.kvalifiseringsprogram.tittel",
          infoText: "informasjonsside.kvalifiseringsprogram.informasjon",
          trueTextKey: "informasjonsside.kvalifiseringsprogram.ja",
          falseTextKey: "informasjonsside.kvalifiseringsprogram.nei",
          errorKey: "informasjonsside.deltarIKvalifiseringsprogram.feilmelding",
        },
        {
          type: "radio",
          name: "inst",
          label: "informasjonsside.institusjon.tittel",
          infoText: "informasjonsside.institusjon.informasjon",
          trueTextKey: "informasjonsside.institusjon.ja",
          falseTextKey: "informasjonsside.institusjon.nei",
          errorKey: "informasjonsside.institusjon.feilmelding",
        },
        {
          type: "radio",
          name: "intro",
          label: "informasjonsside.introprogram.overskrift",
          infoText: "informasjonsside.introprogram.tekst",
          trueTextKey: "informasjonsside.introprogram.false",
          falseTextKey: "informasjonsside.introprogram.true",
          errorKey: "informasjonsside.introprogram.feilmelding",
        },
      ]}
    />
  );
};
