import React from "react";
import { useI18n } from "../../i18n/i18n";
import { useFakta } from "../../api/useFakta";
import { Heading } from "@navikt/ds-react";

interface PersonaliaType {
  alder: string;
  diskresjonskode: null | string;
  etternavn: string;
  fnr: string;
  fornavn: string;
  gjeldendeAdresse: string;
  gjeldendeAdresseType: string;
  kjonn: "m" | "f";
  mellomnavn: null | string;
  navn: string;
  kontonummer: null | string;
  utenlandskKontoBanknavn: null;
  utenlandskKontoLand: null;
}

const Personalia = () => {
  const fakta = useFakta();
  const t = useI18n();

  const personalia = fakta.find((fakta) => fakta.key === "personalia")
    ?.properties as PersonaliaType | undefined;

  return (
    <div>
      <Heading className="text-center pb-8" level="1" size="xlarge">
        {t("personalia.tittel")}
      </Heading>
      <p className="mb-4">{t("personalia.intro")}</p>
      <h2 className="font-bold text-xl">{personalia?.navn}</h2>
      <p className="font-bold text-xl">{personalia?.fnr}</p>
      <p className="mb-4">{personalia?.gjeldendeAdresse}</p>
      <h3 className="font-bold ">{t("personalia.kontonummer")}</h3>
      <div className="mb-4">
        {!personalia?.kontonummer ? (
          <p>{t("personalia.kontonummer.ikkeRegistrert")}</p>
        ) : (
          personalia?.kontonummer
        )}
      </div>
    </div>
  );
};

export default Personalia;
