import { useI18n } from "../../../../i18n/i18n";
import React, { useEffect, useState } from "react";
import { Button, Heading, Modal } from "@navikt/ds-react";
import { Barn } from "./Barn";
import BarnModal from "./BarnModal";
import { useFakta } from "../../../../api/useFakta";

export interface BarnType {
  alder: string;
  etternavn: string;
  fnr: string;
  fornavn: string;
  kjonn: "m" | "f";
  land: string;
  mellomnavn: null | string;
  sammensattnavn: string;
  uniqueKey: "fnr";
}

export const Barnetillegg = () => {
  const fakta = useFakta();
  const t = useI18n();

  useEffect(() => {
    Modal.setAppElement?.("#__next");
  }, []);

  const barn = fakta
    .filter((fakta) => fakta.key === "barn")
    .map((barnFakta) => barnFakta.properties as BarnType);

  const [modalOpen, setModalOpen] = useState(false);
  const closeModal = () => setModalOpen(false);
  const leggTilBarnModal = () => {
    setModalOpen(true);
  };

  return (
    <div id="barnetillegg-skjema">
      <Heading className="text-center pb-8" level="1" size="xlarge">
        {t("barnetillegg.tittel")}
      </Heading>

      <div className="js-barnetillegg-modal-feilliste" data-feilliste />
      <fieldset className="skjema-fieldset blokk">
        <p className="skjema-infotekst mb-4">{t("barnetillegg.informasjon")}</p>
        {barn.length !== 0 ? (
          <p
            data-ng-if="barnetilleggController.harBarn()"
            className="skjema-infotekst mb-8"
          >
            {t("barnetillegg.informasjon.forsorger")}
          </p>
        ) : undefined}

        <div id="barnetillegg" className="blokk-m">
          <Barn barn={barn} />
        </div>
        <div className="legg-til-informasjon">
          {barn.length === 0
            ? t("barnetillegg.leggtil.ingenbarn.informasjon")
            : t("barnetillegg.leggtil.informasjon")}
          {t("barnetilleggController.leggTilBarnInfoTekst()")}
        </div>
        <div className="flex justify-center mt-8">
          <Button
            variant={"secondary"}
            id="leggtilbarnknapp"
            className="knapp knapp-leggtil"
            type="button"
            onClick={leggTilBarnModal}
          >
            {t("barnetillegg.leggtil.knapp")}
          </Button>
        </div>
      </fieldset>
      {modalOpen ? <BarnModal onClose={closeModal} /> : undefined}
    </div>
  );
};
