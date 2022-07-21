import React from "react";
import { useI18n } from "../../../i18n/i18n";
import { Alert } from "@navikt/ds-react";

const VedleggInfoBoks = ({ text }: { text: string }) => {
  const t = useI18n();
  return (
    <div className="mb-8 ">
      <Alert variant="info">
        <h1 className="text-lg font-bold mb-2">{t("vedlegg.leggved")}</h1>
        <ul>
          <li className="list-disc ml-5">{t(text)}</li>
        </ul>
        <p className="mt-4">{t("vedlegg.infoboks.lastopp")}</p>
      </Alert>
    </div>
  );
};

export const ArbeidspraksisVedleggInfoBoks = () => {
  return (
    <VedleggInfoBoks
      text={"tiltaksliste.annetTiltak.tiltakstype.arbeidspraksis.vedleggsnavn"}
    />
  );
};

export default VedleggInfoBoks;
