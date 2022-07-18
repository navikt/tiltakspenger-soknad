import { useI18n } from "../../i18n/i18n";
import { VedledningsSporsmal } from "./VedledningsSporsmal";
import Header from "../../components/Header";
import FooterButtons from "../../components/FooterButtons";

export const Informasjonsside = () => {
  const t = useI18n();

  return (
    <form action="post">
      <Header />
      <div className="side-innhold" data-sidetittel="global.sidetittel">
        <div className="bg-white p-8 flex justify-center">
          <div className="max-w-2xl">
            <div data-feilliste />
            <h2 className="font-bold text-2xl text-center mb-8">
              {t("informasjonsside.tittel")}
            </h2>
            <VedledningsSporsmal />
            <FooterButtons />
          </div>
        </div>
      </div>
    </form>
  );
};

export default Informasjonsside;
