import { useI18n } from "../../../i18n/i18n";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Heading, Modal } from "@navikt/ds-react";
import { BarnQuestions } from "./BarnQuestions";
import BarnModal from "./BarnModal";
import { getBarn } from "../../../api/useFakta";
import { deleteFakta, getFakta, postBarn } from "../../../api/fakta";
import { useSoknadId } from "../../../components/useSoknadId";

export type BarnType = SystemRegistrertBarn | BrukerRegistrertBarn;

export interface SystemRegistrertBarn {
  alder: string;
  etternavn: string;
  fnr: string;
  fornavn: string;
  kjonn: "m" | "f";
  land: string;
  mellomnavn: null | string;
  sammensattnavn: string;
  uniqueKey: "fnr";
  faktumId: number;
}

export interface BrukerRegistrertBarn {
  // Date is converted to string when persisted in backend, but input yields Date
  fodselsdato: Date | string;
  alder?: string;
  etternavn: string;
  fornavn: string;
  land: string;
  faktumId: number;
}

export const isSystemregistrert = (
  barn: BarnType
): barn is SystemRegistrertBarn => "kjonn" in barn;
export const isBrukerRegistrert = (
  barn: BarnType
): barn is BrukerRegistrertBarn => !("kjonn" in barn);

export const BarnetilleggSkjema = () => {
  const [barn, setBarn] = useState<BarnType[]>([]);
  const brukerRegistrerteBarn = barn.filter(isBrukerRegistrert);
  const systemRegistrerteBarn = barn.filter(isSystemregistrert);

  const t = useI18n();
  const soknadId = useSoknadId();

  const [editingIndex, setIsEditingIndex] = useState<number | undefined>(
    undefined
  );

  const fetchBarn = async () => {
    if (!soknadId) return;
    const oppdaterteBarn = getBarn(await getFakta(soknadId));
    setBarn(oppdaterteBarn);
  };

  useEffect(() => {
    Modal.setAppElement?.("#__next");
    fetchBarn();
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const closeModal = useCallback(() => {
    setModalOpen(false);
    setIsEditingIndex(undefined);
  }, [setModalOpen]);

  const leggTilBarnModal = () => {
    setModalOpen(true);
  };

  const createNewBarn = async (barn: BrukerRegistrertBarn) => {
    if (!soknadId) return;
    await postBarn(barn, soknadId);
    await fetchBarn();
    closeModal();
  };

  const updateBarn = (updatedBarn: BrukerRegistrertBarn, index: number) => {
    // TODO: Update via backend?
    const barns = [
      ...barn.slice(0, index),
      updatedBarn,
      ...barn.slice(index + 1),
    ];
    setBarn(barns);
  };

  const handleSaveBarn = useCallback(
    async (newBarn: BrukerRegistrertBarn) => {
      if (editingIndex === undefined) {
        await createNewBarn(newBarn);
      } else {
        await updateBarn(newBarn, editingIndex);
      }
      setIsEditingIndex(undefined);
    },
    [editingIndex, createNewBarn, updateBarn]
  );

  const onChange = useCallback((barnIndex: number) => {
    setIsEditingIndex(barnIndex);
    setModalOpen(true);
  }, []);

  const onDelete = useCallback(
    async (barn: BrukerRegistrertBarn) => {
      await deleteFakta(barn.faktumId);
      await fetchBarn();
    },
    [barn.length, brukerRegistrerteBarn]
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
        <BarnQuestions
          barnActions={{ onChange, onDelete }}
          undocumentedBarn={brukerRegistrerteBarn}
          barn={systemRegistrerteBarn}
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
        isEditing={editingIndex !== undefined}
        onSaveBarn={handleSaveBarn}
      />
    </div>
  );
};
