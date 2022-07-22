import Skjema from "../../components/skjema/Skjema";
import {
  AvbrytSøkTillegStonadWarning,
  InstAvslagWarning,
  KVPAvslagTilleggStonadWarning,
  KVPAvslagWarning,
} from "./AvslagWarning";
import { RadioOption } from "../../components/RadioQuestion";
import { useI18n } from "../../i18n/i18n";

export const VedledningsSporsmal = () => {
  return (
    <Skjema
      fields={[
        {
          type: "radio-bool",
          name: "kvp",
          label: "informasjonsside.deltarIKvalifiseringsprogram.sporsmal",
          infoText: "",
          trueTextKey: "informasjonsside.deltarIKvalifiseringsprogram.false",
          falseTextKey: "informasjonsside.deltarIKvalifiseringsprogram.true",
          errorKey: "informasjonsside.deltarIKvalifiseringsprogram.feilmelding",
        },
        {
          type: "radio-bool",
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
          name: "introTilleggStonad",
          label: "",
          component: KVPAvslagTilleggStonadWarning,
          requires: {
            kvp: "true",
            kvpAvbryt: "true",
          },
        },
        {
          type: "subfield",
          noWrapper: true,
          name: "introSlettSoknad",
          label: "",
          component: KVPAvslagWarning,
          requires: {
            kvp: "true",
            kvpAvbryt: "false",
          },
        },
        {
          type: "radio-bool",
          name: "inst",
          label: "informasjonsside.institusjon.tittel",
          infoText: "informasjonsside.institusjon.informasjon",
          trueTextKey: "informasjonsside.institusjon.ja",
          falseTextKey: "informasjonsside.institusjon.nei",
          errorKey: "informasjonsside.institusjon.feilmelding",
        },
        {
          type: "radio-multi",
          name: "instType",
          label: "informasjonsside.institusjon.ja.hvaslags.sporsmal",
          infoText: "",
          options: instOptions,
          errorKey: "informasjonsside.introprogram.feilmelding",
          requires: {
            inst: "true",
          },
          indent: true,
        },
        {
          type: "subfield",
          name: "avbrytInstSubfield",
          component: AvbrytInst,
          label: "",
          requires: {
            instType: "annet",
          },
        },
        {
          type: "radio-bool",
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

const AvbrytInst = () => {
  const t = useI18n();
  return (
    <>
      <p>
        {t(
          "informasjonsside.institusjon.ja.hvaslags.annet.soketilleggstonad.informasjon"
        )}
      </p>
      <Skjema
        fields={[
          {
            type: "radio-bool",
            name: "avbrytInst",
            label: "informasjonsside.soketilleggsstonad.sporsmal",
            trueTextKey: "informasjonsside.soketilleggsstonad.ja",
            falseTextKey: "informasjonsside.soketilleggsstonad.nei",
            errorKey: "informasjonsside.introprogram.feilmelding",
          },
          {
            type: "subfield",
            name: "avbrytInstWarningTilleggstønader",
            label: "",
            noWrapper: true,
            component: AvbrytSøkTillegStonadWarning,
            requires: {
              avbrytInst: "true",
            },
          },
          {
            type: "subfield",
            name: "avbrytInstWarningSlettSoknad",
            label: "",
            noWrapper: true,
            component: InstAvslagWarning,
            requires: {
              avbrytInst: "false",
            },
          },
        ]}
      />
    </>
  );
};

const instOptions: RadioOption[] = [
  {
    value: "barnevern",
    label: "informasjonsside.institusjon.ja.hvaslags.barneverninstitusjon",
  },
  {
    value: "overgangsbolig",
    label: "informasjonsside.institusjon.ja.hvaslags.overgangsbolig",
  },
  {
    value: "annet",
    label: "informasjonsside.institusjon.ja.hvaslags.annet",
  },
];
