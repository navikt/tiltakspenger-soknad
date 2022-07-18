import { useI18n } from "../../../../i18n/i18n";
import { BarnType } from "./Barnetillegg";
import Question from "../../../../components/Question";
import { Button } from "@navikt/ds-react";
import { useFormContext } from "react-hook-form";

interface Props {
  barn: BarnType[];
  barnActions?: {
    onChange: () => void;
    onDelete: () => void;
  };
}

export const Barn = ({ barn, barnActions }: Props) => {
  const t = useI18n();

  const formContext = useFormContext();

  return (
    <div className="panel panel-ramme panel-fremhevet">
      {barn.map(({ fornavn, etternavn, mellomnavn, fnr, land, alder }, i) => (
        <div key={i} className="bg-stone-100 p-4 border border-gray-400 mb-8">
          <div className="flex flex-col">
            <span className="font-bold">
              {alder}
              <span className="font-medium">
                {t("barnetillegg.barn.aar.label")}
              </span>
            </span>
            <h3 className="font-bold">{`${fornavn} ${
              mellomnavn || ""
            } ${etternavn}`}</h3>
            <span>{fnr}</span>
            <span>
              {land
                ? t("barnetillegg.barn.land.label")
                : t("barnetillegg.barn.land.ingenregistrerte")}
              <span className="font-bold">{land}</span>
            </span>
          </div>
          {barnActions ? <BarnActions {...barnActions} /> : undefined}
          <Question
            title={"barnetillegg.barn.sokebarnetillegg.sporsmal"}
            name={`child.${i}.sokerBarneTillegg`}
            label={"barnetillegg.barn.sokebarnetillegg.sporsmal"}
            trueTextKey={"barnetillegg.barn.sokebarnetillegg.ja"}
            falseTextKey={"barnetillegg.barn.sokebarnetillegg.nei"}
          />
        </div>
      ))}
    </div>
  );
};

const BarnActions = ({
  onChange,
  onDelete,
}: {
  onChange: () => void;
  onDelete: () => void;
}) => {
  return (
    <div className="mt-4">
      <span className="mr-4">
        <Button onClick={onChange} variant="secondary">
          Endre
        </Button>
      </span>
      <Button onClick={onDelete} variant="danger">
        Slett
      </Button>
    </div>
  );
};
