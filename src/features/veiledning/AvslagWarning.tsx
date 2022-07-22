import { useI18n } from "../../i18n/i18n";
import { Alert, Button } from "@navikt/ds-react";

const AvslagWarning = ({ text }: { text: string }) => {
  const t = useI18n();
  return (
    <Alert variant={"warning"}>
      <div className="">
        <h2 className="text-2xl mb-4 font-bold">{t("avslag.tittel")}</h2>
        <p className="mb-4">{t(text)}</p>
        <Button variant="secondary">{t("avslag.knapp")}</Button>
      </div>
    </Alert>
  );
};

export const AvbrytSøkTillegStonadWarning = () => (
  <AvslagWarning
    text={
      "informasjonsside.institusjon.ja.hvaslags.annet.soketilleggstonad.ja.avslag.tekst"
    }
  />
);

export const KVPAvslagTilleggStonadWarning = () => (
  <AvslagWarning text={"deltarIKvalifiseringsprogram.advarsel.informasjon"} />
);
export const InstAvslagWarning = () => (
  <AvslagWarning
    text={
      "informasjonsside.institusjon.ja.hvaslags.annet.soketilleggstonad.nei.avslag.tekst"
    }
  />
);
