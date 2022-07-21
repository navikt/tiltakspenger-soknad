import React, { useState } from "react";
import { Button } from "@navikt/ds-react";
import { useI18n } from "../../../i18n/i18n";
import UtbetalingBolk, { UtbetalingFields } from "./UtbetalingBolk";
import VedleggInfoBoks from "../tiltaksliste/VedleggInfoBoks";

const emptyBolk: (
  bolkId: number
) => Record<UtbetalingFields | "bolkId", any> = (bolkId) => ({
  fra: undefined,
  til: undefined,
  prosent: undefined,
  utbetaler: undefined,
  bolkId,
});

type BolkWithId = Record<UtbetalingFields | "bolkId", any>;

const UtbetalingerSkjema = () => {
  const t = useI18n();

  const [nextBolkId, setNextBolkId] = useState(1);
  const [bolker, setBolker] = useState<BolkWithId[]>([
    emptyBolk(nextBolkId - 1),
  ]);

  const addBolk = () => {
    setBolker([...bolker, { ...emptyBolk(nextBolkId) }]);
    setNextBolkId(nextBolkId + 1);
  };
  const removeBolk = (index: number) => () => {
    // TODO: This does not work
    console.log("Removing index", index);
    const restBolker = bolker.filter((_, bolkIndex) => bolkIndex !== index);
    setBolker(restBolker);
  };

  return (
    <div>
      {bolker.map(({ bolkId }, index) => (
        <UtbetalingBolk
          key={bolkId}
          name={`utbetalinger.${bolkId}`}
          onDelete={removeBolk(index)}
          deleteable={index !== 0}
        />
      ))}
      <div className="my-4 flex justify-center">
        <Button type="button" onClick={addBolk}>
          {t("trygdogpensjon.harsokt.utbetaler.leggtil")}
        </Button>
      </div>
      <VedleggInfoBoks text={"trygdogpensjon.vedlegg.andreutbetalinger"} />
    </div>
  );
};

export default UtbetalingerSkjema;
