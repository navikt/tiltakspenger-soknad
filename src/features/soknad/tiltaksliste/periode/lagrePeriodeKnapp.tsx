import { useI18n } from "../../../../i18n/i18n";

export const HelpForDev = ({ erIEndreStatus }: { erIEndreStatus: boolean }) => {
  const t = useI18n();

  return (
    <div className="blokk-s">
      <button
        type="button"
        aria-pressed={erIEndreStatus}
        className="knapp knapp-hoved knapp-liten"
        data-lagre-barn
        data-ng-click="lagrePeriodeKnappController.lagre()"
        data-fremdriftsindikator-knapp
      >
        {t("lagrePeriodeKnappController.hentKnappetekst()")}
      </button>
    </div>
  );
};
