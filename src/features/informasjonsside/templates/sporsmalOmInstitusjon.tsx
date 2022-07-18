import { useI18n } from "../../../i18n/i18n";
import Question from "../../../components/Question";

export const SporsmalOmInstitusjon = () => {
  const t = useI18n();

  return (
    <div>
      <h3 className="typo-undertittel blokk-s">
        {t("informasjonsside.institusjon.tittel")}
      </h3>
      <div className="skjema-infotekst blokk">
        {t("informasjonsside.institusjon.informasjon")}
      </div>
      <div
        className="js-valideringsomrade skjema-feilomrade"
        data-radioinput-validering
        data-nav-faktum="informasjonsside.institusjon"
        data-feilmelding="informasjonsside.institusjon.feilmelding"
      >
        <div>
          <h4 className="skjema-sporsmal">
            {t("informasjonsside.institusjon.sporsmal")}
          </h4>
          <div data-nav-hjelpetekstelement>
            {t("{{informasjonsside.institusjon.sporsmal.hjelpetekst.tittel")}
          </div>
        </div>
        <div
          data-navradio
          data-value="nei"
          data-navlabel="informasjonsside.institusjon.nei"
          data-name="informasjonsside.institusjon"
        ></div>
        <div
          data-navradio
          data-value="ja"
          data-navlabel="informasjonsside.institusjon.ja"
          data-name="informasjonsside.institusjon"
        >
          <div
            className="js-valideringsomrade skjema-feilomrade"
            data-radioinput-validering
            data-nav-faktum="informasjonsside.institusjon.ja.hvaslags"
            data-feilmelding="informasjonsside.institusjon.ja.hvaslags.feilmelding"
          >
            <h5 className="skjema-sporsmal">
              {t("informasjonsside.institusjon.ja.hvaslags.sporsmal")}
            </h5>
            <div
              data-navradio
              data-value="barneverninstitusjon"
              data-navlabel="informasjonsside.institusjon.ja.hvaslags.barneverninstitusjon"
              data-name="informasjonsside.institusjon.ja.hvaslags"
            ></div>
            <div>
              <div data-nav-hjelpetekstelement>
                {t(
                  "{{informasjonsside.institusjon.ja.hvaslags.overgangsbolig.hjelpetekst.tittel"
                )}
              </div>
              <div
                data-navradio
                data-value="overgangsbolig"
                data-navlabel="informasjonsside.institusjon.ja.hvaslags.overgangsbolig"
                data-name="informasjonsside.institusjon.ja.hvaslags"
              ></div>
            </div>
            <div
              data-navradio
              data-value="annet"
              data-navlabel="informasjonsside.institusjon.ja.hvaslags.annet"
              data-name="informasjonsside.institusjon.ja.hvaslags"
            >
              <div
                data-soke-tilleggsstonad
                data-faktum="informasjonsside.institusjon.ja.hvaslags.annet.soketilleggstonad"
                data-nokkel="informasjonsside.institusjon.ja.hvaslags.annet.soketilleggstonad"
                data-overskriftselement="h6"
              ></div>
            </div>
            <div role="alert" aria-live="polite">
              <p
                className="skjema-feilmelding js-feilmelding"
                data-ng-if="harValideringsfeil(this)"
              >
                {t("informasjonsside.institusjon.ja.hvaslags.feilmelding")}
              </p>
            </div>
          </div>
        </div>
        <div role="alert" aria-live="polite">
          <p
            className="skjema-feilmelding js-feilmelding"
            data-ng-if="harValideringsfeil(this)"
          >
            {t("informasjonsside.institusjon.feilmelding")}
          </p>
        </div>
      </div>
    </div>
  );
};
