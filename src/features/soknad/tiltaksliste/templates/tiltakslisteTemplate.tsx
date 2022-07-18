export const HelpForDev = () => {
  return (
    <div className="skjemainnhold" data-novalidate>
      <div className="blokk" data-gruppevaliderer>
        <div data-feilliste />
        <div data-ng-if="tiltakslisteController.harRegistrerteTiltakIArena()">
          <div data-ng-include="'js/soknad/tiltaksliste/templates/velgTiltakTemplate.html'" />
        </div>
        <div data-ng-if="!tiltakslisteController.harRegistrerteTiltakIArena()">
          <div className="panel panel-ramme">
            <p
              className="hode hode-advarsel"
              data-ng-bind-html="tiltakslisteController.informasjonstekstVedIngenTiltak()"
            />
          </div>
          <div data-ng-include="'js/soknad/tiltaksliste/templates/annetTiltakTemplate.html'" />
        </div>
      </div>
      <div data-nesteknapp-bolk />
    </div>
  );
};
