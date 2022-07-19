import { useI18n } from "../../i18n/i18n";
import { Alert, Button } from "@navikt/ds-react";

const AvslagWarning = () => {
  const t = useI18n();
  return (
    <Alert variant={"warning"}>
      <div className="">
        <h2 className="text-2xl mb-4 font-bold">{t("avslag.tittel")}</h2>
        <p className="mb-4">
          {t("deltarIKvalifiseringsprogram.advarsel.informasjon")}
        </p>
        <Button variant="secondary">{t("avslag.knapp")}</Button>
      </div>
    </Alert>
  );
};

export default AvslagWarning;
