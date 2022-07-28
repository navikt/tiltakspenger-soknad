import { useI18n } from "../../../i18n/i18n";
import Skjema from "../../../components/skjema/Skjema";
import { Heading } from "@navikt/ds-react";
import React from "react";
import UtbetalingerSkjema from "./UtbetalingerSkjema";

export const Utbetalinger = () => {
  const t = useI18n();

  return (
    <>
      <Heading className="text-center pb-8" level="1" size="xlarge">
        {t("trygdogpensjon.tittel")}
      </Heading>
      <p>{t("trygdogpensjon.informasjon")}</p>
      <Skjema
        fields={[
          {
            type: "radio-bool",
            name: "harUtbetalinger",
            label: "trygdogpensjon.sporsmal",
            trueTextKey: "trygdogpensjon.ja",
            falseTextKey: "trygdogpensjon.nei",
            errorKey: "trygdogpensjon.feilmelding",
          },
          {
            type: "subfield",
            name: "utbetalinger",
            label: "",
            component: UtbetalingerSkjema,
            requires: {
              harUtbetalinger: "true",
            },
          },
        ]}
      />
    </>
  );
};
