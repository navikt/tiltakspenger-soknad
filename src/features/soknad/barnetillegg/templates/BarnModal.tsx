import React, { useEffect, useState } from "react";
import { Button, Alert, Modal } from "@navikt/ds-react";
import Skjema from "../../../../components/skjema/Skjema";
import { useI18n } from "../../../../i18n/i18n";
import { fetchLand } from "../../../../api/land";
import FooterButtons from "../../../../components/FooterButtons";

interface Props {
  onClose: () => void;
}

const BarnModal = ({ onClose }: Props) => {
  const t = useI18n();

  const [land, setLand] = useState([]);

  useEffect(() => {
    fetchLand().then((land) => setLand(land));
  }, []);

  return (
    <Modal open onClose={onClose}>
      <div className="p-8">
        <h1 className="font-bold">{t("barnetillegg.nyttbarn.tittel")}</h1>
        <Skjema
          fields={[
            {
              type: "text",
              name: "fornavn",
              label: "barnetillegg.nyttbarn.fornavn",
            },
            {
              type: "text",
              name: "etternavn",
              label: "barnetillegg.nyttbarn.etternavn",
            },
            {
              type: "date",
              name: "fodselsdato",
              label: "barnetillegg.nyttbarn.fodselsdato",
            },
            {
              type: "select",
              label: "barnetillegg.nyttbarn.land",
              options: land,
              name: "land",
            },
          ]}
        />
        <Alert className={"mt-6"} variant={"info"}>
          <h2>{t("vedlegg.leggved")}</h2>
          <ul>
            <li className="list-disc">
              {t("barnetillegg.nyttbarn.vedlegg.fodselsbevis")}
            </li>
          </ul>
          <div className="mt-4">{t("vedlegg.infoboks.lastopp")}</div>
        </Alert>

        <div className="mt-4">
          <FooterButtons onClick={() => {}} onCancel={onClose} />
        </div>
      </div>
    </Modal>
  );
};

export default BarnModal;
