import { useI18n } from "../../../../i18n/i18n";

export const HelpForDev = () => {
  const t = useI18n();

  return (
    <div data-nav-faktum="barn" data-ikke-auto-lagre="true">
      <div
        className="js-valideringsomrade skjema-feilomrade"
        data-nav-faktum-property="harinntekt"
        data-auto-lagre="true"
        data-radioinput-validering
        data-feilmelding="barnetillegg.barn.harinntekt.feilmelding"
      >
        <div>
          <h5 className="skjema-sporsmal">
            {t("barnetillegg.barn.harinntekt.sporsmal")}
          </h5>
          <div data-nav-hjelpetekstelement>
            {t("{{barnetillegg.barn.harinntekt.hjelpetekst.tittel")}
          </div>
        </div>
        <div
          data-navradio
          data-value="nei"
          data-index="{{$index}}"
          data-name="barnetillegg.harinntekt-{{$index}}"
          data-navlabel="barnetillegg.barn.harinntekt.nei"
        />
        <div
          data-navradio
          data-value="ja"
          data-index="{{$index}}"
          data-name="barnetillegg.harinntekt-{{$index}}"
          data-navlabel="barnetillegg.barn.harinntekt.ja"
        >
          <div data-nav-faktum="barn">
            <div
              data-tekstinput
              data-nav-faktum-property="inntekt"
              data-input-type="tel"
              data-modell="faktum"
              data-label="'barnetillegg.barn.inntekt'"
              data-input-enhet="'soknad.kr'"
              data-input-class="input-s"
              data-regexvalidering="^[0-9][0-9., ]*$"
              data-feilmeldinger="{required: 'barnetillegg.barn.inntekt.feilmelding', pattern: 'barnetillegg.barn.inntekt.patternfeilmelding'}"
            />
          </div>
        </div>
        <div role="alert" aria-live="polite">
          <p className="js-feilmelding skjema-feilmelding">
            {t("barnetillegg.barn.harinntekt.feilmelding")}
          </p>
        </div>
      </div>
    </div>
  );
};
