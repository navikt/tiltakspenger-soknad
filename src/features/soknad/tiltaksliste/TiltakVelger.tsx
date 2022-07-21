import { useI18n } from "../../../i18n/i18n";
import { Panel, Heading } from "@navikt/ds-react";
import { WarningColored } from "@navikt/ds-icons";
import { AnnetTiltakSkjema } from "./AnnetTiltakSkjema";
import React from "react";

export const TiltakVelger = () => {
  const t = useI18n();
  return (
    <div>
      <Heading className="text-center pb-8" level="1" size="xlarge">
        {t("tiltaksliste.tittel")}
      </Heading>
      <Panel border={true} className="flex flex-col">
        <WarningColored className="text-3xl mb-4 self-center" />
        {t("tiltaksliste.annetTiltak.infotekst")}
      </Panel>
      <h3 className="skjema-sporsmal my-4">
        {t("tiltaksliste.velgTiltak.sporsmal")}
      </h3>

      <div
        className="js-valideringsomrade skjema-feilomrade"
        data-radioinput-validering
        data-feilmelding="tiltaksliste.feilmelding"
        data-nav-faktum="tiltaksliste.valgtTiltak"
      >
        <div data-ng-repeat="tiltak in tiltakslisteController.tiltaksliste track by tiltak.faktumId">
          <div
            data-navradio
            data-index="{{$index}}"
            data-value="{{tiltak.faktumId}}"
            data-name="tiltaksliste.velgTiltak"
            data-navlabel="{{tiltakslisteController.lagTiltakLabel(tiltak).tekst}}"
            data-cmsargumenter="{{tiltakslisteController.lagTiltakLabel(tiltak).argumenter}}"
          >
            <div
              data-ng-if="tiltakslisteController.skalVisePeriodeboks(tiltak)"
              data-ng-include="'js/soknad/tiltaksliste/templates/tiltaksperiode.html'"
            />
          </div>
        </div>
        <div className={"mb-8"}>
          <AnnetTiltakSkjema />
        </div>

        {/*
        <div role="alert" aria-live="polite">
          <p className="skjema-feilmelding js-feilmelding">
            {t("tiltaksliste.feilmelding")}
          </p>
        </div>*/}
      </div>
    </div>
  );
};
