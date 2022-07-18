import { useI18n } from "../../../../i18n/i18n";

export const HelpForDev = () => {
  const t = useI18n();

  return (
    <div className="soknad" data-sidetittel="sidetittel.avbryt">
      <div className="begrensning blokk-invert">
        <section className="panel">
          <h1 className="hode hode-dekorert hode-innholdstittel hode-feil">
            {t(" informasjonsside.slettsoknad.tittel")}
          </h1>
          <div className="text-center">
            <p className="typo-element">
              {t(" informasjonsside.slettsoknad.informasjon")}
            </p>
          </div>
          <div className="knapperad">
            <div className="blokk" data-novalidate>
              <button
                type="button"
                className="knapp knapp-fare"
                data-ng-click="slettSoknadController.slettSoknadOgGaTilAvbruttside()"
                data-fremdriftsindikator
              >
                {t("informasjonsside.slettsoknad.knapp.tekst")}
              </button>
            </div>
            <p>
              <a className="lenke-fremhevet" href="#/">
                {t("informasjonsside.slettsoknad.tilbake")}
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
