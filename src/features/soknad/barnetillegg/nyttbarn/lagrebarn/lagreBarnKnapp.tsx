import { useI18n } from "../../../../../i18n/i18n";

export const HelpForDev = () => {
  const t = useI18n();

  return (
    <div className="knapperad knapperad-adskilt">
      <div className="blokk-s">
        <button
          type="button"
          className="knapp knapp-hoved knapp-liten"
          data-lagre-barn
          data-ng-click="lagre()"
          data-fremdriftsindikator-knapp
        >
          {t("barnetillegg.nyttbarn.lagre")}
        </button>
      </div>
      <p>
        <a href="#/soknad">{t("barnetillegg.nyttbarn.avbryt")}</a>
      </p>
    </div>
  );
};
