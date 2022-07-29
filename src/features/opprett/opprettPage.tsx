import { useI18n, useParsedText } from "../../i18n/i18n";
import { StartSoknadKnapp } from "./startSoknadKnapp";
import { InformationColored } from "@navikt/ds-icons";
import Header from "../../components/Header";

export const OpprettPage = () => {
  const t = useI18n();

  const parse = useParsedText();

  return (
    <div>
      <Header hideSteps />
      <div className="bg-white flex justify-center py-12">
        <div className="max-w-2xl flex flex-col items-stretch">
          <InformationColored className="text-5xl mb-4 self-center" />
          <h2 className="text-center text-4xl font-bold">
            {t("opprett.soknad.tittel")}
          </h2>
          <div className="max-w-full overflow-hidden text-ellipsis mt-8 mb-8">
            {parse("opprett.soknad.informasjon")}
          </div>
          <StartSoknadKnapp />
        </div>
      </div>
    </div>
  );
};
