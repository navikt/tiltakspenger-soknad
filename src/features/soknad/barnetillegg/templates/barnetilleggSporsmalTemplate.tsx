import { useI18n } from "../../../../i18n/i18n";

export const HelpForDev = () => {
  const t = useI18n();

  return (
    <div data-nav-faktum="barn" data-ikke-auto-lagre="true">
      <div
        className="js-valideringsomrade skjema-feilomrade"
        data-nav-faktum-property="sokerbarnetillegg"
        data-auto-lagre="true"
        data-radioinput-validering
        data-feilmelding="barnetillegg.barn.sokebarnetillegg.feilmelding"
      >
        <h4 className="skjema-sporsmal">
          {t("barnetillegg.barn.sokebarnetillegg.sporsmal")}
        </h4>
        <div
          data-navradio
          data-value="ja"
          data-index="{{$index}}"
          data-name="barnetillegg.sokebarnetillegg-{{$index}}"
          data-navlabel="barnetillegg.barn.sokebarnetillegg.ja"
        >
          <div
            data-ng-if="barnetilleggController.barnEr13AarEllerEldre(barn)"
            data-ng-include="'js/soknad/barnetillegg/templates/barnetilleggInntektTemplate.html'"
          />
        </div>
        <div
          data-navradio
          data-value="nei"
          data-index="{{$index}}"
          data-name="barnetillegg.sokebarnetillegg-{{$index}}"
          data-navlabel="barnetillegg.barn.sokebarnetillegg.nei"
          data-paneltype="panel-relatert"
        >
          <p className="hode hode-advarsel">
            {t("barnetillegg.barn.sokebarnetillegg.ikkekrav.informasjon")}
          </p>
        </div>
        <div role="alert" aria-live="polite">
          <p className="js-feilmelding skjema-feilmelding">
            {t("barnetillegg.barn.sokebarnetillegg.feilmelding")}
          </p>
        </div>
      </div>
    </div>
  );
};
