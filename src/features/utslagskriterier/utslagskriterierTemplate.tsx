import { useI18n } from "../../i18n/i18n";

export const HelpForDev = () => {
  const t = useI18n();

  return (
    <div>
      <header className="soknad-header">
        <div data-nav-tittel="global.tittel" />
      </header>
      <div className="side-innhold" data-panelbelyst data-ng-cloak>
        <div
          id="utslagskriterier"
          data-ng-if="utslagskriterierController.kriterierIkkeGyldig()"
        >
          <div
            className="blokk-xl typo-infotekst"
            data-ng-if="utslagskriterierController.forGammel()"
          >
            <h2 className="hode hode-dekorert hode-advarsel blokk">
              {t("utslagskriterier.forgammel.tittel")}
            </h2>
            <p>
              <span>{t("utslagskriterier.forgammel.tekst.1")}</span>
              <a
                href="{{ utslagskriterierController.alderspensjonUrl }}"
                target="_blank"
              >
                {t("utslagskriterier.forgammel.tekst.2")}
              </a>
            </p>
          </div>
          <div
            className="blokk-s typo-infotekst"
            data-ng-if="utslagskriterierController.forUng()"
          >
            <h2 className="hode hode-dekorert hode-advarsel blokk">
              {t("utslagskriterier.forung.tittel")}
            </h2>
            <div>{t("utslagskriterier.forung.tekst")}</div>
          </div>
          <div className="knapperad blokk">
            <button
              type="button"
              className="knapp knapp-fare"
              data-ng-click="utslagskriterierController.gaTilDittNav()"
            >
              {t("avbrytsoknad.knapp.tekst")}
            </button>
          </div>
          <div
            className="knapperad knapperad-adskilt"
            data-ng-if="utslagskriterierController.kriterierIkkeGyldig()"
          >
            <p>
              <a
                href="#"
                data-ng-click="utslagskriterierController.fortsettLikevel($event)"
              >
                {t("utslagskriterier.fortsettsoknad.1")}
              </a>
              ,<span>{t("utslagskriterier.fortsettsoknad.2")}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
