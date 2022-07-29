import { BarnType, BrukerRegistrertBarn } from "./BarnetilleggSkjema";
import Question from "../../../components/skjema/Question";
import BarnActions, { BarnActionHandlers } from "./BarnActions";
import BarnCard from "./BarnCard";
import HiddenBarnFields from "./HIddenBarnFIelds";

interface Props {
  barn: BarnType[];
  undocumentedBarn: BrukerRegistrertBarn[];
  barnActions?: BarnActionHandlers;
}

export const BarnQuestions = ({
  barn,
  barnActions,
  undocumentedBarn,
}: Props) => {
  const realBarns = barn.length;

  return (
    <div className="panel panel-ramme panel-fremhevet">
      {barn.map((barn, i) => (
        <div
          key={i}
          className="bg-stone-100 p-4 border border-gray-400 mb-8 rounded"
        >
          <BarnCard barn={barn} />
          <HiddenBarnFields barn={barn} name={`child.${i}`} />
          <Question
            title={"barnetillegg.barn.sokebarnetillegg.sporsmal"}
            name={`child.${i}.sokerBarneTillegg`}
            label={"barnetillegg.barn.sokebarnetillegg.sporsmal"}
            trueTextKey={"barnetillegg.barn.sokebarnetillegg.ja"}
            falseTextKey={"barnetillegg.barn.sokebarnetillegg.nei"}
            errorKey={"barnetillegg.barn.sokebarnetillegg.feilmelding"}
          />
        </div>
      ))}
      {undocumentedBarn.map((barn, i) => (
        <div
          key={i}
          className="bg-stone-100 p-4 border border-gray-400 mb-8 rounded"
        >
          <BarnCard barn={barn} />
          <Question
            title={"barnetillegg.barn.sokebarnetillegg.sporsmal"}
            name={`child.${i + realBarns}.sokerBarneTillegg`}
            label={"barnetillegg.barn.sokebarnetillegg.sporsmal"}
            trueTextKey={"barnetillegg.barn.sokebarnetillegg.ja"}
            falseTextKey={"barnetillegg.barn.sokebarnetillegg.nei"}
            errorKey={"barnetillegg.barn.sokebarnetillegg.feilmelding"}
          />
          {barnActions ? (
            <BarnActions barn={barn} index={i} {...barnActions} />
          ) : undefined}
        </div>
      ))}
    </div>
  );
};
