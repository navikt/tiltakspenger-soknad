import Skjema from "../../../components/skjema/Skjema";
import React from "react";
import { Button } from "@navikt/ds-react";
import { useI18n } from "../../../i18n/i18n";
import { dateFieldValidator } from "../../../components/skjema/DateField";

interface Props {
  onDelete: () => void;
  deleteable?: boolean;
  name: string;
}

export type UtbetalingFields = "utbetaler" | "prosent" | "fra" | "til";

const UtbetalingBolk = ({ name, onDelete, deleteable = true }: Props) => {
  const t = useI18n();

  return (
    <>
      <Skjema
        fields={[
          {
            name: `${name}.utbetaler`,
            type: "text",
            label: "trygdogpensjon.harsokt.utbetaler",
            errorKey: "trygdogpensjon.harsokt.utbetaler.feilmelding",
          },
          {
            name: `${name}.prosent`,
            type: "text",
            inputType: "number",
            label: "trygdogpensjon.harsokt.prosentandel",
          },
          {
            type: "fratil",
            name: name,
            fraLabel: "trygdogpensjon.harsokt.dato.fra",
            tilLabel: "trygdogpensjon.harsokt.dato.til",
            validations: {
              fra: dateFieldValidator(
                "trygdogpensjon.harsokt.dato.fra.feilmelding"
              ),
              til: undefined,
            },
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
