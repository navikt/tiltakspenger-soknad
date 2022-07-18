import { useI18n } from "../../../../../i18n/i18n";

export const HelpForDev = () => {
  const t = useI18n();

  return (
    <div data-modalside>
      <div className="panel side-innhold">
        <h1 className="tittel-dekorert typo-innholdstittel blokk">
          {t("nyttBarnController.hentTittel()")}
        </h1>
        <button
          type="button"
          className="modal-lukk ng-binding"
          data-ng-click="nyttBarnController.avbryt()"
        >
          {t("barnetillegg.nyttbarn.lukk")}
        </button>
        <form data-gruppevaliderer noValidate>
          <div className="js-barnetillegg-modal-feilliste" data-feilliste />
          <div
            data-nav-faktum="nyttBarnController.hentFaktum()"
            data-ikke-auto-lagre="true"
            className="js-valideringsomrade"
            data-feilmelding="barn.fornavn.feilmelding"
          >
            <div data-ng-include="nyttBarnController.templates.sporsmal" />
            <div data-lagre-barn-knapp />
          </div>
        </form>
      </div>
    </div>
  );
};
