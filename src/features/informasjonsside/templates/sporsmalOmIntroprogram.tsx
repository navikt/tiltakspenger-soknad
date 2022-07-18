import { useI18n } from "../../../i18n/i18n";
import Question from "../../../components/Question";

export const SporsmalOmIntroprogram = () => {
  const t = useI18n();

  return (
    <div>
      <h3 className="typo-undertittel blokk-s">
        {t("informasjonsside.introprogram.overskrift")}
      </h3>
      <div className="skjema-infotekst">
        {t("informasjonsside.introprogram.tekst")}
      </div>
      <div
        className="blokk-s"
        data-nav-faktum="informasjonsside.deltarIIntroprogram"
        data-booleanradio
        data-radioinput-validering
        data-feilmelding="informasjonsside.introprogram.feilmelding"
        data-nokkel="informasjonsside.introprogram"
      >
        <div className="blokk-s">
          <div data-nav-faktum="informasjonsside.deltarIIntroprogram.info">
            <div
              className="blokk-s"
              data-tekstinput
              data-nav-faktum-property="kommune"
              data-modell="faktum"
              data-label="'informasjonsside.introprogram.deltar.kommune'"
              data-input-class="input-m"
              data-feilmelding="'informasjonsside.introprogram.deltar.kommune.feilmelding'"
            ></div>
            <div
              className="blokk-s"
              data-tekstinput
              data-nav-faktum-property="bydel"
              data-modell="faktum"
              data-ikke-required="true"
              data-label="'informasjonsside.introprogram.deltar.bydel'"
              data-input-class="input-m"
            ></div>
            <div
              className="blokk-s"
              data-tekstinput
              data-nav-faktum-property="kontonummer"
              data-modell="faktum"
              data-label="'informasjonsside.introprogram.deltar.kontonummer'"
              data-input-class="input-s"
              data-minlength={11}
              data-input-type="tel"
              data-maxlength={13}
              data-ikke-required="true"
              data-regexvalidering="^(?:[0-9]{11}|[0-9]{4}[. ][0-9]{2}[. ][0-9]{5})$"
              data-feilmeldinger="{pattern:'informasjonsside.introprogram.deltar.kontonummer.feilmelding'}"
            ></div>
            <div
              className="blokk-xxs"
              data-nav-dato-intervall
              data-lagre="lagreFaktum()"
              data-fra-dato="faktum.properties.fom"
              data-til-dato="faktum.properties.tom"
              data-label="informasjonsside.introprogram.deltar.dato"
              data-er-fradato-required="true"
              data-er-tildato-required="false"
              data-er-fremtidigdato-tillatt="true"
              data-er-tidligere-dato-tillatt="true"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
