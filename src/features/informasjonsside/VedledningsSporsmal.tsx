import Skjema from "../../components/skjema/Skjema";
import AvslagWarning from "./AvslagWarning";

export const VedledningsSporsmal = () => {
  return (
    <Skjema
      fields={[
        {
          type: "radio",
          name: "kvp",
          label: "informasjonsside.deltarIKvalifiseringsprogram.sporsmal",
          infoText: "",
          trueTextKey: "informasjonsside.deltarIKvalifiseringsprogram.false",
          falseTextKey: "informasjonsside.deltarIKvalifiseringsprogram.true",
          errorKey: "informasjonsside.deltarIKvalifiseringsprogram.feilmelding",
        },
        {
          type: "radio",
          name: "kvpAvbryt",
          label: "informasjonsside.soketilleggsstonad.sporsmal",
          infoText: "deltarIKvalifiseringsprogram.advarsel.informasjon",
          trueTextKey: "informasjonsside.soketilleggsstonad.ja",
          falseTextKey: "informasjonsside.soketilleggsstonad.nei",
          errorKey: "informasjonsside.deltarIKvalifiseringsprogram.feilmelding",
          requires: {
            kvp: "true",
          },
          indent: true,
        },
        {
          type: "subfield",
          noWrapper: true,
          name: "intro",
          label: "",
          component: AvslagWarning,
          requires: {
            kvp: "true",
            kvpAvbryt: "true",
          },
        },
        {
          type: "subfield",
          noWrapper: true,
          name: "intro",
          label: "",
          component: AvslagWarning,
          requires: {
            kvp: "true",
            kvpAvbryt: "false",
          },
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
          name: "instType",
          label: "informasjonsside.institusjon.ja.hvaslags.sporsmal",
          infoText: "",
          trueTextKey:
            "informasjonsside.institusjon.ja.hvaslags.barneverninstitusjon",
          falseTextKey:
            "informasjonsside.institusjon.ja.hvaslags.overgangsbolig",
          errorKey: "informasjonsside.introprogram.feilmelding",
          requires: {
            inst: "true",
          },
          indent: true,
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
