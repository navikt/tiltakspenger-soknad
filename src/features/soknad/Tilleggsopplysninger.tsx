import React from "react";
import { Heading, Textarea } from "@navikt/ds-react";
import { useI18n } from "../../i18n/i18n";

const Tilleggsopplysninger = () => {
  const t = useI18n();

  return (
    <div>
      <Heading className="text-center pb-8" level="1" size="xlarge">
        {t("tilleggopplysninger.tittel")}
      </Heading>
      <p className="mb-8">{t("fritekst.informasjon")}</p>
      <Textarea label={t("fritekst.label")} />
    </div>
  );
};

export default Tilleggsopplysninger;
