import { useI18n } from "../../../../../i18n/i18n";

export const HelpForDev = () => {
  const t = useI18n();

  return (
    <div>
      <div
        data-tekstinput
        className="blokk-s"
        data-nav-faktum-property="fornavn"
        data-modell="faktum"
        data-label="'barnetillegg.nyttbarn.fornavn'"
        data-input-class="input-l"
        data-feilmelding="'barnetillegg.nyttbarn.fornavn.feilmelding'"
      />
      <div
        data-tekstinput
        className="blokk-s"
        data-nav-faktum-property="etternavn"
        data-modell="faktum"
        data-label="'barnetillegg.nyttbarn.etternavn'"
        data-input-class="input-l"
        data-feilmelding="'barnetillegg.nyttbarn.etternavn.feilmelding'"
      />
      <div data-nav-faktum-property="fodselsdato" className="blokk-s">
        <div
          data-dato
          data-ng-model="faktum.value"
          data-tidligst-dato="nyttBarnController.dato16aarSiden"
          data-tidligst-dato-feilmelding="barnetillegg.nyttbarn.fodselsdato.forgammel.feilmelding"
          data-er-required="true"
          data-label="barnetillegg.nyttbarn.fodselsdato"
          data-feilmelding="barnetillegg.nyttbarn.fodselsdato.feilmelding"
        />
      </div>
      <div className="blokk-s js-valideringsomrade">
        <label htmlFor="land">{t("barnetillegg.nyttbarn.land")}</label>
        <div className="select-container">
          <select
            data-select-blur-validering
            data-nav-faktum-property="land"
            className="select-input"
            id="land"
            data-ng-required="true"
            data-feilmelding="barnetillegg.nyttbarn.land.feilmelding"
            data-ng-model="faktum.value"
            data-aktiv-feilmelding
            data-ng-options="l.value as l.text for l in nyttBarnController.land"
          />
        </div>
        <div role="alert" aria-live="polite">
          <p className="melding skjema-feilmelding js-feilmelding">
            {t("barnetillegg.nyttbarn.land.feilmelding")}
          </p>
        </div>
      </div>
      <div className="bolk-tilleggsinfo">
        <div
          data-vedlegginfoboks
          data-vedleggtekster="nyttBarnController.vedleggstekster"
          data-overskriftselement="h2"
        />
      </div>
    </div>
  );
};
