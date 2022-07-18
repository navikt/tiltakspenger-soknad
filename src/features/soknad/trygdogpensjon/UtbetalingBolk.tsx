import Skjema from "../../../components/skjema/Skjema";
import React from "react";
import { Button } from "@navikt/ds-react";
import { useI18n } from "../../../i18n/i18n";

interface Props {
  onDelete: () => void;
  onChange: (formState: Record<UtbetalingFields, any>) => void;
  deleteable?: boolean;
}

export type UtbetalingFields = "utbetaler" | "prosent" | "fra" | "til";

const UtbetalingBolk = ({ onChange, onDelete, deleteable = true }: Props) => {
  const t = useI18n();

  return (
    <>
      <Skjema
        fields={[
          {
            name: "utbetaler",
            type: "text",
            label: "trygdogpensjon.harsokt.utbetaler",
          },
          {
            name: "prosent",
            type: "text",
            label: "trygdogpensjon.harsokt.prosentandel",
          },
          {
            name: "fra",
            type: "date",
            label: "trygdogpensjon.harsokt.dato.fra",
          },
          {
            name: "til",
            type: "date",
            label: "trygdogpensjon.harsokt.dato.til",
          },
        ]}
      />
      <div className="border-b mb-4 border-gray-400 flex justify-end">
        {deleteable ? (
          <Button onClick={onDelete} variant="tertiary">
            {t("trygdogpensjon.harsokt.utbetaler.slett")}
          </Button>
        ) : undefined}
      </div>
    </>
  );
};

export default UtbetalingBolk;
