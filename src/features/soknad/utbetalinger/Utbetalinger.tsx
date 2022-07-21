import { useI18n } from "../../../i18n/i18n";
import Skjema from "../../../components/skjema/Skjema";
import { Heading } from "@navikt/ds-react";
import React from "react";
import UtbetalingerSkjema from "./UtbetalingerSkjema";

export const Utbetalinger = () => {
  const t = useI18n();

  return (
    <>
      <Heading className="text-center pb-8" level="1" size="xlarge">
        {t("trygdogpensjon.tittel")}
      </Heading>
      <p>{t("trygdogpensjon.informasjon")}</p>
      <Skjema
        fields={[
          {
            type: "radio",
            name: "harUtbetalinger",
            label: "trygdogpensjon.sporsmal",
            trueTextKey: "trygdogpensjon.ja",
            falseTextKey: "trygdogpensjon.nei",
            errorKey: "trygdogpensjon.feilmelding",
          },
          {
            type: "subfield",
            name: "utbetalinger",
            label: "",
            component: UtbetalingerSkjema,
            requires: {
              harUtbetalinger: "true",
            },
          },
        ]}
      />
    </>
  );

  return (
    <div className="skjemainnhold" data-novalidate>
      <div data-gruppevaliderer>
        <div data-feilliste />
        <div className="skjema-infotekst blokk">
          {t("trygdogpensjon.informasjon")}
        </div>
        <fieldset className="skjema-fieldset blokk">
          <div
            className="js-valideringsomrade skjema-feilomrade"
            data-radioinput-validering
            data-nav-faktum="trygdogpensjon"
            data-feilmelding="trygdogpensjon.feilmelding"
          >
            <div>
              <h3 className="skjema-sporsmal">
                {t("trygdogpensjon.sporsmal")}
              </h3>
              <div data-nav-hjelpetekstelement>
                {t("{{trygdogpensjon.hjelpetekst.tittel")}
              </div>
            </div>
            <div
              data-navradio
              data-value="false"
              data-navlabel="trygdogpensjon.nei"
              data-name="trygdogpensjon"
            />
            <div
              data-navradio
              data-value="true"
              data-navlabel="trygdogpensjon.ja"
              data-name="trygdogpensjon"
            >
              <div>
                <div
                  className="blokk-adskilt"
                  data-ng-repeat="trygdogpensjon_utbetalere in trygdOgPensjonController.utbetalere track by trygdogpensjon_utbetalere.faktumId"
                >
                  <div data-nav-faktum="trygdogpensjon_utbetalere">
                    <div
                      className="blokk-s"
                      data-tekstinput
                      data-nav-faktum-property="utbetaler"
                      data-modell="faktum"
                      data-label="'trygdogpensjon.harsokt.utbetaler'"
                      data-input-class="input-l"
                      data-feilmelding="'trygdogpensjon.harsokt.utbetaler.feilmelding'"
                    />
                    <div
                      className="blokk-s"
                      data-tekstinput
                      data-nav-faktum-property="prosent"
                      data-modell="faktum"
                      data-label="'trygdogpensjon.harsokt.prosentandel'"
                      data-input-class="input-xs"
                      data-input-enhet="'trygdogpensjon.harsokt.prosentandel.hoyrelabel'"
                      data-maxlength={3}
                      data-max={100}
                      data-input-type="tel"
                      data-ikke-required="true"
                      data-regexvalidering="^\d*$"
                      data-feilmeldinger="{required: 'trygdogpensjon.harsokt.prosentandel.feilmelding', pattern:'trygdogpensjon.harsokt.prosentandel.feilmelding.tegn', max:'trygdogpensjon.harsokt.prosentandel.feilmelding.utenforintervall'}"
                    />
                    <div
                      className="blokk-xxs"
                      data-nav-dato-intervall
                      data-lagre="lagreFaktum()"
                      data-fra-dato="trygdogpensjon_utbetalere.properties.fom"
                      data-til-dato="trygdogpensjon_utbetalere.properties.tom"
                      data-label="trygdogpensjon.harsokt.dato"
                      data-er-fradato-required="true"
                      data-er-tildato-required="false"
                      data-er-fremtidigdato-tillatt="true"
                      data-er-tidligere-dato-tillatt="true"
                    />
                    <p
                      data-ng-if="trygdOgPensjonController.visSlett($index)"
                      className="blokk-xxs"
                    >
                      <a
                        className="lenke-fremhevet"
                        href="javascript:void(0)"
                        role="button"
                        data-ng-click="trygdOgPensjonController.slettUtbetaler(trygdogpensjon_utbetalere, $index)"
                      >
                        {t("trygdogpensjon.harsokt.utbetaler.slett")}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              <div className="knapperad knapperad-dekorert">
                <button
                  className="knapp knapp-leggtil js-legg-til-utbetaler"
                  type="button"
                  data-aktiv-feilmelding
                  data-ng-click="trygdOgPensjonController.leggTilUtbetaler(trygdogpensjon_utbetalere)"
                >
                  {t("trygdogpensjon.harsokt.utbetaler.leggtil")}
                </button>
              </div>
              <div
                className="infoboks-vedlegg-adskilt"
                data-vedlegginfoboks
                data-vedleggtekster="'trygdogpensjon.vedlegg.andreutbetalinger'"
              />
            </div>
            <div role="alert" aria-live="polite">
              <p className="skjema-feilmelding js-feilmelding">
                {t("trygdogpensjon.feilmelding")}
              </p>
            </div>
          </div>
        </fieldset>
      </div>
      <div data-nesteknapp-bolk />
    </div>
  );
};
