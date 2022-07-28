import { useI18n } from "../../../i18n/i18n";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Heading, Modal } from "@navikt/ds-react";
import { BarnQuestion } from "./BarnQuestion";
import BarnModal, { UndocumentedBarn } from "./BarnModal";
import { useBarn, useFakta } from "../../../api/useFakta";

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

export const BarnetilleggSkjema = () => {
  const barn = useBarn();
  const t = useI18n();
  const [undocumentedBarns, setUndocumentedBarns] = useState(
    [] as UndocumentedBarn[]
  );
  const [isEditingIndex, setIsEditingIndex] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    Modal.setAppElement?.("#__next");
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const closeModal = useCallback(() => {
    setModalOpen(false);
    setIsEditingIndex(undefined);
  }, [setModalOpen]);

  const leggTilBarnModal = () => {
    setModalOpen(true);
  };

  const handleSetBarn = (barn: UndocumentedBarn, index: number) => {
    const barns = [
      ...undocumentedBarns.slice(0, index),
      barn,
      ...undocumentedBarns.slice(index + 1),
    ];
    setUndocumentedBarns(barns);
    closeModal();
  };

  const handleAddBarn = useCallback(
    (newBarn: UndocumentedBarn) => {
      if (isEditingIndex === undefined) {
        handleSetBarn(newBarn, undocumentedBarns.length);
      } else {
        handleSetBarn(newBarn, isEditingIndex);
      }
      setIsEditingIndex(undefined);
    },
    [isEditingIndex, handleSetBarn]
  );

  const onChange = useCallback((barnIndex: number) => {
    setIsEditingIndex(barnIndex);
    setModalOpen(true);
  }, []);

  const onDelete = useCallback(
    (barnIndex: number) => {
      setUndocumentedBarns(undocumentedBarns.filter((_, i) => i !== barnIndex));
    },
    [barn.length, undocumentedBarns]
  );

  return (
    <div id="barnetillegg-skjema">
      <Heading className="text-center pb-8" level="1" size="xlarge">
        {t("barnetillegg.tittel")}
      </Heading>
      <fieldset>
        <p className="skjema-infotekst mb-4">{t("barnetillegg.informasjon")}</p>
        {barn.length !== 0 ? (
          <p className="mb-8">{t("barnetillegg.informasjon.forsorger")}</p>
        ) : undefined}
        <BarnQuestion
          barnActions={{ onChange, onDelete }}
          undocumentedBarn={undocumentedBarns}
          barn={barn}
        />
        <div className="flex flex-1 justify-center">
          <span className="max-w-md text-center">
            {barn.length === 0
              ? t("barnetillegg.leggtil.ingenbarn.informasjon")
              : t("barnetillegg.leggtil.informasjon")}
          </span>
        </div>
        <div className="flex justify-center mt-8 mb-8">
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
      <BarnModal
        onClose={closeModal}
        open={modalOpen}
        isEditing={isEditingIndex !== undefined}
        onAddBarn={handleAddBarn}
      />
    </div>
  );
};
