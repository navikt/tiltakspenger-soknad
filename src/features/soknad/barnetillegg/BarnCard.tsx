import { BarnType, isSystemregistrert } from "./BarnetilleggSkjema";
import { useI18n } from "../../../i18n/i18n";
import { getAlder } from "./common";

const BarnCard = ({ barn }: { barn: BarnType }) => {
  const { fornavn, etternavn, land } = barn;
  const t = useI18n();
  const alder = isSystemregistrert(barn)
    ? barn.alder
    : getAlder(barn.fodselsdato);
  return (
    <div className="flex flex-col">
      <span className="font-bold">
        {alder}
        <span className="ml-2 font-medium">
          {t("barnetillegg.barn.aar.label")}
        </span>
      </span>
      <h3 className="font-bold">{`${fornavn} ${etternavn}`}</h3>
      {isSystemregistrert(barn) ? <span>{barn.fnr}</span> : undefined}
      <span>
        {land
          ? t("barnetillegg.barn.land.label")
          : t("barnetillegg.barn.land.ingenregistrerte")}
        <span className="ml-2 font-bold">{land}</span>
      </span>
    </div>
  );
};

export default BarnCard;
