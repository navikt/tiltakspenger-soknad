import { useI18n } from "../../../i18n/i18n";

export const HelpForDev = () => {
  const t = useI18n();

  return (
    <div>
      <h3 className="typo-undertittel blokk-s">
        {t("informasjonsside.dagpenger.tittel")}
      </h3>
      <div className="skjema-infotekst blokk">
        {t("informasjonsside.dagpenger.informasjon")}
      </div>
      <div
        className="js-valideringsomrade skjema-feilomrade"
        data-radioinput-validering
        data-nav-faktum="informasjonsside.dagpenger"
        data-feilmelding="informasjonsside.dagpenger.feilmelding"
      >
        <h4 className="skjema-sporsmal">
          {t("informasjonsside.dagpenger.sporsmal")}
        </h4>
        <div
          data-navradio
          data-value="utsette"
          data-navlabel="informasjonsside.dagpenger.utsette"
          data-name="informasjonsside.dagpenger"
          data-paneltype="panel-relatert"
        >
          <p className="hode hode-advarsel">
            {t("informasjonsside.dagpenger.utsette.informasjon")}
          </p>
        </div>
        <div
          data-navradio
          data-value="beholde"
          data-navlabel="informasjonsside.dagpenger.beholde"
          data-name="informasjonsside.dagpenger"
        >
          <div
            data-soke-tilleggsstonad
            data-faktum="informasjonsside.dagpenger.beholde.soketilleggsstonad"
            data-nokkel="informasjonsside.dagpenger.beholde.soketilleggsstonad"
          ></div>
        </div>
        <div role="alert" aria-live="polite">
          <p
            className="skjema-feilmelding js-feilmelding"
            data-ng-if="harValideringsfeil(this)"
          >
            {t("informasjonsside.dagpenger.feilmelding")}
          </p>
        </div>
      </div>
    </div>
  );
};
