import { useI18n } from "../../../../i18n/i18n";

export const HelpForDev = () => {
  const t = useI18n();

  return (
    <div>
      <h4 className="skjema-sporsmal">
        {t("tiltaksliste.tiltak.periode.overskrift")}
      </h4>
      <p>{t("tiltakslisteController.hentPeriodetekst(tiltak)")}</p>
      <div data-nav-faktum="tiltak" data-gruppevaliderer data-auto-lagre="true">
        <div
          data-ng-if="!tiltakslisteController.erTrue(tiltak.properties.erIEndreStatus)"
          className="datepicker-intervall-datoer blokk-xxs"
        >
          <div className="datepicker fra-dato">
            <h5 className="label">
              {t("tiltaksliste.tiltak.periode.dato.fra")}
            </h5>
            <p className="typo-infotekst">
              {"{"}
              {"{"}
              tiltakslisteController.formaterDato(tiltak.properties.startdato)
              {"}"}
              {"}"}
            </p>
          </div>
          <div className="datepicker til-dato">
            <h5 className="label">
              {t("tiltaksliste.tiltak.periode.dato.til")}
            </h5>
            <p className="typo-infotekst">
              {"{"}
              {"{"}
              tiltakslisteController.formaterDato(tiltak.properties.sluttdato)
              {"}"}
              {"}"}
            </p>
          </div>
        </div>
        <div data-ng-if="tiltakslisteController.erTrue(tiltak.properties.erIEndreStatus)">
          <div
            className="blokk-xxs"
            data-ng-if="tiltakslisteController.tiltakErTypeArbeidspraksis(tiltak)"
            data-nav-dato-intervall=""
            data-lagre="lagreFaktum()"
            data-fra-dato="tiltak.properties.startdato"
            data-til-dato="tiltak.properties.sluttdato"
            data-label="tiltaksliste.tiltak.periode.dato"
            data-er-fradato-required="true"
            data-er-tildato-required="true"
            data-er-fremtidigdato-tillatt="true"
            data-er-tidligere-dato-tillatt="true"
          />
          <div
            data-ng-if="!tiltakslisteController.tiltakErTypeArbeidspraksis(tiltak)"
            className="datepicker-intervall-datoer blokk"
          >
            <div className="datepicker fra-dato">
              <h5 className="label">
                {t("tiltaksliste.tiltak.periode.dato.fra")}
              </h5>
              <p className="typo-infotekst">
                {"{"}
                {"{"}
                tiltakslisteController.formaterDato(tiltak.properties.startdato)
                {"}"}
                {"}"}
              </p>
            </div>
            <div className="datepicker til-dato">
              <div
                data-dato
                data-ng-model="tiltak.properties.sluttdato"
                data-er-required="true"
                data-label="tiltaksliste.tiltak.periode.dato.til"
                data-feilmelding="tiltaksliste.tiltak.periode.dato.til.feilmelding"
                data-er-fremtidigdato-tillatt="true"
                data-er-tidligere-dato-tillatt="true"
                data-tidligst-dato="tiltak.properties.startdato"
                data-tidligst-dato-feilmelding="tiltaksliste.tiltak.periode.dato.til.fortidlig.feilmelding"
              />
            </div>
          </div>
        </div>
        <div data-lagre-periode-knapp />
        <a
          href="javascript:void(0)"
          role="button"
          data-ng-if="tiltakslisteController.tilbakestillLenkeSkalVises(tiltak)"
          data-ng-click="tiltakslisteController.tilbakestillPeriode(tiltak)"
        >
          {t("tiltaksliste.tiltak.periode.tilbakestill")}
        </a>
      </div>
    </div>
  );
};
