import { useI18n } from "../../../i18n/i18n";

export const HelpForDev = () => {
  const t = useI18n();
  return (
    <div className="knapperad knapperad-adskilt">
      <div className="blokk-s">
        <button
          className="knapp knapp-hoved"
          type="button"
          data-ng-click="validerOgGaTilNesteSide($event)"
          data-fremdriftsindikator-knapp
        >
          {t("nesteknapp.tekst")}
        </button>
      </div>
      <p>
        <a href="{{dittnavUrl}}">{t("avbrytsoknad.knapp.tekst")}</a>
      </p>
    </div>
  );
};
