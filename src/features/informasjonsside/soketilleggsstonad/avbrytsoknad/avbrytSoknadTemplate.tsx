import { useI18n } from "../../../../i18n/i18n";

export const HelpForDev = () => {
  const t = useI18n();

  return (
    <div>
      <p className="hode hode-advarsel">{t("avbryttekst")}</p>
      <div className="knapperad">
        <button
          type="button"
          className="knapp knapp-liten knapp-fare"
          data-ng-click="avbrytSoknadController.gaTilAvbrytside($event)"
        >
          {t("informasjonsside.avbryt.tiltakspenger.knapp")}
        </button>
      </div>
    </div>
  );
};
