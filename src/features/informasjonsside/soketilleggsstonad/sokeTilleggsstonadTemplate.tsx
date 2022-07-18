import { useI18n } from "../../../i18n/i18n";

export const HelpForDev = () => {
  const t = useI18n();

  return (
    <div
      className="js-valideringsomrade skjema-feilomrade"
      data-radioinput-validering
      data-nav-faktum="faktum"
      data-feilmelding="informasjonsside.soketilleggsstonad.feilmelding"
    >
      <div className="blokk-s">{t("informasjon")}</div>
      <div
        data-nav-heading
        data-overskriftselement="{{overskriftselement}}"
        data-css-klasse="skjema-sporsmal"
      >
        {t("{{informasjonsside.soketilleggsstonad.sporsmal")}
      </div>
      <div
        data-navradio
        data-paneltype="panel-relatert"
        data-value="ja"
        data-index="{{ indeks }}"
        data-name="{{ name }}"
        data-navlabel="informasjonsside.soketilleggsstonad.ja"
      >
        <div data-avbryt-soknad data-avbryttekst="avbryttekst"></div>
      </div>
      <div
        data-navradio
        data-paneltype="panel-relatert"
        data-value="nei"
        data-index="{{ indeks }}"
        data-name="{{ name }}"
        data-navlabel="informasjonsside.soketilleggsstonad.nei"
      >
        <div
          data-avslaginfoboks
          data-avslagtekst="avslagtekst"
          data-overskriftselement="h6"
        ></div>
      </div>
      <div role="alert" aria-live="polite">
        <p className="skjema-feilmelding js-feilmelding">
          {t("informasjonsside.soketilleggsstonad.feilmelding")}
        </p>
      </div>
    </div>
  );
};
