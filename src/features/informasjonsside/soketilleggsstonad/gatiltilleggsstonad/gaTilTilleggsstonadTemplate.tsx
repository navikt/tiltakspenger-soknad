import { useI18n } from "../../../../i18n/i18n";

export const HelpForDev = () => {
  const t = useI18n();

  return (
    <div className="soknad" data-sidetittel="sidetittel.avbryt">
      <div className="begrensning blokk-invert">
        <section className="panel">
          <h1 className="hode hode-dekorert hode-innholdstittel hode-advarsel">
            {t("informasjonsside.soknadslettet.tittel")}
          </h1>
          <div className="skjema-infotekst side-innhold">
            <p>{t("informasjonsside.soknadslettet.informasjon")}</p>
          </div>
          <div className="knapperad knapperad-adskilt">
            <a
              className="lenke-uthevet"
              href="{{gaTilTilleggsstonadController.tilleggsstonadUrl}}"
              data-fremdriftsindikator="grå"
            >
              {t("informasjonsside.gatiltilleggsttonad.lenkenavn")}
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};
