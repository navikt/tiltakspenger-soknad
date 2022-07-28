import { useI18n } from "../../../i18n/i18n";
import Skjema, { Field } from "../../../components/skjema/Skjema";
import { Option } from "../../../components/skjema/SelectField";
import { useMemo } from "react";
import { ArbeidspraksisVedleggInfoBoks } from "./VedleggInfoBoks";
import { dateFieldValidator } from "../../../components/skjema/DateField";

export const AnnetTiltakSkjema = () => {
  const t = useI18n();
  const tekstDag = t("tiltaksliste.antalldager.dag");
  const teskstDager = t("tiltaksliste.antalldager.dager");
  const dagerOptions = antallDager(tekstDag, teskstDager);
  const typerOptions = tiltakstyper.map((option) => ({
    value: option.value,
    text: t(option.text),
  }));

  const memoFields = useMemo(() => {
    return fields(typerOptions, dagerOptions);
  }, []);

  return <Skjema fields={memoFields} />;
};

const tiltakstyper = [
  {
    value: "AMO",
    text: "tiltaksliste.tiltakstype.amokurs",
  },
  {
    value: "PRAKSORD",
    text: "tiltaksliste.tiltakstype.arbeidspraksis",
  },
  {
    value: "JOBSOK",
    text: "tiltaksliste.tiltakstype.jobbsokekurs",
  },
  { value: "Annet", text: "tiltaksliste.tiltakstype.annet" },
];

const antallDager = (tekstDag: string, tekstDager: string) => [
  { value: "1 " + tekstDag, text: "1 " + tekstDag },
  { value: "2 " + tekstDager, text: "2 " + tekstDager },
  { value: "3 " + tekstDager, text: "3 " + tekstDager },
  { value: "4 " + tekstDager, text: "4 " + tekstDager },
  { value: "5 " + tekstDager, text: "5 " + tekstDager },
];

type FieldNames =
  | "tiltakstype"
  | "fra"
  | "til"
  | "beskrivelse"
  | "arrangoernavn"
  | "adresse"
  | "postnummer"
  | "antallDager"
  | "uploadInfoBox"
  | "periode";

const fields = (
  options: Option[],
  dagerOptions: Option[]
): Field<FieldNames>[] => [
  {
    name: "tiltakstype",
    type: "select",
    label: "tiltaksliste.annetTiltak.tiltakstype",
    options: options,
  },
  {
    type: "subfield",
    component: ArbeidspraksisVedleggInfoBoks,
    noWrapper: true,
    name: "uploadInfoBox",
    label: "",
    requires: { tiltakstype: "PRAKSORD" },
  },
  {
    type: "fratil",
    name: "periode",
    tilLabel: "tiltaksliste.annettiltak.periode.dato.fra",
    fraLabel: "tiltaksliste.annettiltak.periode.dato.til",
    validations: {
      fra: dateFieldValidator(
        "tiltaksliste.annettiltak.periode.dato.fra.feilmelding"
      ),
      til: dateFieldValidator(
        "tiltaksliste.annettiltak.periode.dato.til.feilmelding"
      ),
    },
  },
  {
    name: "beskrivelse",
    type: "text",
    label: "tiltaksliste.annetTiltak.beskrivelse",
    requires: { tiltakstype: "Annet" },
  },
  {
    name: "arrangoernavn",
    type: "text",
    label: "tiltaksliste.annetTiltak.arrangoernavn.hjelpetekst.tittel",
    errorKey: "tiltaksliste.annetTiltak.arrangoernavn.feilmelding",
  },
  {
    name: "adresse",
    type: "text",
    label: "tiltaksliste.annetTiltak.adresse",
  },
  {
    name: "postnummer",
    type: "text",
    label: "tiltaksliste.annetTiltak.postnummer",
  },
  {
    name: "antallDager",
    type: "select",
    label: "tiltaksliste.annetTiltak.antallDager",
    options: dagerOptions,
  },
];
