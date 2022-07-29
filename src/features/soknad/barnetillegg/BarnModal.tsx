import React, { useEffect, useState } from "react";
import { Modal } from "@navikt/ds-react";
import Skjema from "../../../components/skjema/Skjema";
import { useI18n } from "../../../i18n/i18n";
import { fetchLand } from "../../../api/land";
import FooterButtons from "../../../components/FooterButtons";
import { BarnType, BrukerRegistrertBarn } from "./BarnetilleggSkjema";
import {
  SubmitErrorHandler,
  SubmitHandler,
  useFormContext,
  useWatch,
} from "react-hook-form";
import VedleggInfoBoks from "../tiltaksliste/VedleggInfoBoks";
import { dateFieldValidator } from "../../../components/skjema/DateField";

interface Props {
  onClose: () => void;
  open: boolean;
  isEditing: boolean;
  onSaveBarn: (barn: BrukerRegistrertBarn) => void;
}

type FormValues = BrukerRegistrertBarn & { child: BarnType[] };

const BarnModal = ({ onClose, open, onSaveBarn, isEditing }: Props) => {
  const t = useI18n();
  const [landOptions, setLandOptions] = useState([]);
  const { handleSubmit, resetField } = useFormContext<FormValues>();
  const [fornavn, etternavn, fodselsdato, land] = useWatch({
    name: ["fornavn", "etternavn", "fodselsdato", "land"],
  });
  const barn = { fornavn, etternavn, fodselsdato, land, faktumId: 0 };
  const resetModalForm = () => {
    resetField("land");
    resetField("fornavn");
    resetField("etternavn");
    resetField("fodselsdato");
  };
  const onSubmit: SubmitHandler<FormValues> = async ({
    fornavn,
    etternavn,
    fodselsdato,
    land,
  }: BrukerRegistrertBarn) => {
    const barn = { fornavn, etternavn, fodselsdato, land, faktumId: 0 };
    onSaveBarn(barn);
    resetModalForm();
  };
  const onError: SubmitErrorHandler<FormValues> = (err) => {
    if (Object.keys(err).length === 1 && err.child) {
      return onSaveBarn(barn);
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
                errorKey: "barn.fornavn.feilmelding",
              },
              {
                type: "text",
                name: "etternavn",
                label: "barnetillegg.nyttbarn.etternavn",
                errorKey: "barn.etternavn.feilmelding",
              },
              {
                type: "date",
                name: "fodselsdato",
                label: "barnetillegg.nyttbarn.fodselsdato",
                validations: dateFieldValidator("barn.fodselsdato.feilmelding"),
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
        <VedleggInfoBoks text={"barnetillegg.nyttbarn.vedlegg.fodselsbevis"} />

        <div className="mt-4">
          <FooterButtons onClick={submit} onCancel={onClose} />
        </div>
      </div>
    </Modal>
  );
};

export default BarnModal;
