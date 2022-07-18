import React from "react";
import Page from "../../components/Page";
import { useI18n } from "../../i18n/i18n";

const StartSoknad = () => {
  const t = useI18n();
  return (
    <Page>
      <>
        <header className="soknad-header">
          <div data-nav-tittel="skjema.tittel"></div>
        </header>
        <div
          className="side-innhold"
          data-panelbelyst
          data-sidetittel="global.sidetittel"
          data-ng-cloak
        >
          <div data-novalidate data-gruppevaliderer>
            <h2 className="hode hode-advarsel hode-innholdstittel hode-dekorert">
              {t("opprett.soknad.tittel")}
            </h2>
            <div className="skjema-infotekst blokk">
              {t("opprett.soknad.informasjon")}
            </div>
            <div data-start-soknad-knapp></div>
          </div>
        </div>
      </>
    </Page>
  );
};

export default StartSoknad;
