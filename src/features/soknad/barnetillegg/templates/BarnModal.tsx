import React, { useEffect, useState } from "react";
import { Alert, Modal } from "@navikt/ds-react";
import Skjema from "../../../../components/skjema/Skjema";
import { useI18n } from "../../../../i18n/i18n";
import { fetchLand } from "../../../../api/land";
import FooterButtons from "../../../../components/FooterButtons";
import { BarnType } from "./Barnetillegg";
import {
  SubmitErrorHandler,
  SubmitHandler,
  useFormContext,
  useWatch,
} from "react-hook-form";

interface Props {
  onClose: () => void;
  open: boolean;
  isEditing: boolean;
  onAddBarn: (barn: UndocumentedBarn) => void;
}

export interface UndocumentedBarn {
  fornavn: string;
  etternavn: string;
  fodselsdato: Date;
  land: string;
}

type FormValues = UndocumentedBarn & { child: BarnType[] };

const BarnModal = ({ onClose, open, onAddBarn, isEditing }: Props) => {
  const t = useI18n();
  const [landOptions, setLandOptions] = useState([]);
  const { handleSubmit, resetField } = useFormContext<FormValues>();
  const [fornavn, etternavn, fodselsdato, land] = useWatch({
    name: ["fornavn", "etternavn", "fodselsdato", "land"],
  });
  const barn = { fornavn, etternavn, fodselsdato, land };
  const resetModalForm = () => {
    resetField("land");
    resetField("fornavn");
    resetField("etternavn");
    resetField("fodselsdato");
  };
  const onSubmit: SubmitHandler<FormValues> = ({
    fornavn,
    etternavn,
    fodselsdato,
    land,
  }: UndocumentedBarn) => {
    // TODO: Need to know barn-index, either to set existing child or create new
    const barn = { fornavn, etternavn, fodselsdato, land };
    onAddBarn(barn);
    resetModalForm();
  };
  const onError: SubmitErrorHandler<FormValues> = (err) => {
    if (Object.keys(err).length === 1 && err.child) {
      return onAddBarn(barn);
    }
  };
  const submit = handleSubmit(onSubmit, onError);

  useEffect(() => {
    fetchLand().then((land) => setLandOptions(land));
  }, []);

  const _onClose = () => {
    if (isEditing) {
      resetModalForm();
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={_onClose}>
      <div className="p-8">
        <h1 className="font-bold">{t("barnetillegg.nyttbarn.tittel")}</h1>
        <form>
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
                options: landOptions,
                name: "land",
              },
            ]}
          />
        </form>
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
          <FooterButtons onClick={submit} onCancel={onClose} />
        </div>
      </div>
    </Modal>
  );
};

export default BarnModal;
