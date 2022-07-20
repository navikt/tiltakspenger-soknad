import { useI18n } from "../../../i18n/i18n";
import { TextField, ErrorSummary, HelpText, Select } from "@navikt/ds-react";
import Skjema, { Field } from "../../../components/skjema/Skjema";
import { Option } from "../../../components/skjema/SelectField";
import { useMemo } from "react";

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

  return (
    <div data-nav-faktum="tiltaksliste.annetTiltak">
      <div className="js-valideringsomrade blokk-s">
        <Select label={t("tiltaksliste.annetTiltak.tiltakstype")}>
          {tiltakstyper.map((tiltaksType, i) => (
            <option key={i} value={tiltaksType.value}>
              {t(tiltaksType.text)}
            </option>
          ))}
        </Select>
        <div role="alert" aria-live="polite">
          <p className="skjema-feilmelding js-feilmelding">
            {t("tiltaksliste.annetTiltak.tiltakstype.feilmelding")}
          </p>
        </div>
      </div>
      <div
        data-ng-if="tiltakslisteController.tiltakErTypeArbeidspraksis(faktum)"
        className="blokk blokk-adskilt"
      >
        <div
          data-vedlegginfoboks
          data-vedleggtekster="'tiltaksliste.annetTiltak.tiltakstype.arbeidspraksis.vedleggsnavn'"
        />
      </div>
      <div
        data-ng-if="tiltakslisteController.tiltakErTypeAnnet(faktum)"
        className="blokk-s"
        data-tekstinput
        data-nav-faktum-property="beskrivelse"
        data-modell="faktum"
        data-label="'tiltaksliste.annetTiltak.beskrivelse'"
        data-input-class="input-l"
        data-feilmelding="'tiltaksliste.annetTiltak.beskrivelse.feilmelding'"
      />
      <div
        className="blokk-xxs"
        data-nav-dato-intervall
        data-lagre="lagreFaktum()"
        data-fra-dato="faktum.properties.fom"
        data-til-dato="faktum.properties.tom"
        data-label="tiltaksliste.annettiltak.periode.dato"
        data-er-fradato-required="true"
        data-er-tildato-required="true"
        data-er-fremtidigdato-tillatt="true"
        data-er-tidligere-dato-tillatt="true"
        data-senest-sluttdato="tiltakslisteController.datoEttArFrem"
        data-senest-sluttdato-feilmelding="tiltaksliste.annettiltak.periode.dato.forsent.feilmelding"
      />
      <div data-ng-if="!tiltakslisteController.brukerHarDiskresjonskode()">
        <div
          className="blokk-s"
          data-tekstinput
          data-nav-faktum-property="arrangoernavn"
          data-modell="faktum"
          data-label="'tiltaksliste.annetTiltak.arrangoernavn'"
          data-hjelpetekst="tiltaksliste.annetTiltak.arrangoernavn.hjelpetekst"
          data-hjelpetekstinline="true"
          data-input-class="input-l"
          data-feilmelding="'tiltaksliste.annetTiltak.arrangoernavn.feilmelding'"
        />
        <div
          className="blokk-s"
          data-tekstinput
          data-nav-faktum-property="adresse"
          data-ikke-required="true"
          data-modell="faktum"
          data-label="'tiltaksliste.annetTiltak.adresse'"
          data-input-class="input-l"
          data-feilmelding="'tiltaksliste.annetTiltak.adresse.feilmelding'"
        />

        <TextField
          label={t("tiltaksliste.annetTiltak.postnummer")}
          size="medium"
        />
        <div className="blokk-s" data-nav-faktum-property="postnummer">
          <div
            data-postnummer
            data-lagre="lagreFaktum()"
            data-modell="faktum"
            data-navlabel="tiltaksliste.annetTiltak.postnummer"
            data-ikke-required="true"
            data-feilmeldinger="{
                            minlength: 'tiltaksliste.annetTiltak.postnummer.forKort.feilmelding',
                            pattern: 'tiltaksliste.annetTiltak.postnummer.pattern.feilmelding',
                            ikkePoststed: 'tiltaksliste.annetTiltak.postnummer.ikkeGyldigPostnummer.feilmelding'
                        }"
          />
        </div>
      </div>

      <div className={"my-8 flex"}>
        <Select
          className={"flex-1 mr-6"}
          label={t("tiltaksliste.annetTiltak.antallDager")}
        >
          {dagerOptions.map((option) => (
            <option value={option.value}>{option.text}</option>
          ))}
        </Select>
        <HelpText>
          <div className={"max-w-lg"}>
            <h1 className={"text-xl font-bold text-center"}>
              {t("tiltaksliste.annetTiltak.antallDager.hjelpetekst.tittel")}
            </h1>
            <span>
              {t("tiltaksliste.annetTiltak.antallDager.hjelpetekst.tekst")}
            </span>
          </div>
        </HelpText>
      </div>

      <ErrorSummary>
        <ErrorSummary.Item>
          {t("tiltaksliste.annetTiltak.antallDager.feilmelding")}
        </ErrorSummary.Item>
      </ErrorSummary>
    </div>
  );
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
  | "antallDager";

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
    name: "fra",
    type: "date",
    label: "tiltaksliste.annettiltak.periode.dato.fra",
  },
  {
    name: "til",
    type: "date",
    label: "tiltaksliste.annettiltak.periode.dato.til",
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
