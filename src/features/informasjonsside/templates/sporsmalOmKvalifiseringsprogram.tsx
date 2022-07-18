import { useI18n } from "../../../i18n/i18n";
import Question from "../../../components/Question";

export const SporsmalOmKvalifiseringsprogram = () => {
  const t = useI18n();

  return (
    <div>
      <h3 className="typo-undertittel blokk-s">
        {t("informasjonsside.kvalifiseringsprogram.tittel")}
      </h3>
      <div className="skjema-infotekst blokk">
        {t("informasjonsside.kvalifiseringsprogram.informasjon")}
      </div>
      <div
        className="js-valideringsomrade skjema-feilomrade"
        data-radioinput-validering
        data-nav-faktum="informasjonsside.kvalifiseringsprogram"
        data-feilmelding="informasjonsside.kvalifiseringsprogram.feilmelding"
        data-nokkel="informasjonsside.introprogram"
      >
        <div>
          <h4 className="skjema-sporsmal">
            {t("informasjonsside.kvalifiseringsprogram.sporsmal")}
          </h4>
          <div data-nav-hjelpetekstelement>
            {t(
              "{{informasjonsside.kvalifiseringsprogram.sporsmal.hjelpetekst.tittel"
            )}
          </div>
        </div>
        <div
          data-navradio
          data-value="nei"
          data-navlabel="informasjonsside.kvalifiseringsprogram.nei"
        ></div>
        <div
          data-navradio
          data-value="ja"
          data-navlabel="informasjonsside.kvalifiseringsprogram.ja"
        >
          <div
            data-soke-tilleggsstonad
            data-faktum="informasjonsside.kvalifiseringsprogram.ja.soketilleggsstonad"
            data-nokkel="informasjonsside.kvalifiseringsprogram.ja.soketilleggsstonad"
          ></div>
        </div>
        <div role="alert" aria-live="polite">
          <p
            className="skjema-feilmelding js-feilmelding"
            data-ng-if="harValideringsfeil(this)"
          >
            {t("informasjonsside.kvalifiseringsprogram.feilmelding")}
          </p>
        </div>
      </div>
    </div>
  );
};
