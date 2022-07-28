import { useI18n } from "../../../i18n/i18n";
import { BarnType } from "./BarnetilleggSkjema";
import Question from "../../../components/skjema/Question";
import { Button } from "@navikt/ds-react";
import { UndocumentedBarn } from "./BarnModal";
import { useFormContext } from "react-hook-form";
import { useCallback } from "react";
import BarnActions from "./BarnActions";

interface Props {
  barn: BarnType[];
  undocumentedBarn: UndocumentedBarn[];
  barnActions?: {
    onChange: (barnIndex: number) => void;
    onDelete: (barnIndex: number) => void;
  };
}

export const BarnQuestion = ({
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

const BarnCard = ({
  barn: { fornavn, etternavn, land, ...props },
}: {
  barn: BarnType | UndocumentedBarn;
}) => {
  const t = useI18n();
  const alder =
    (props as BarnType)?.alder ||
    getAlder((props as UndocumentedBarn).fodselsdato);
  return (
    <div className="flex flex-col">
      <span className="font-bold">
        {alder}
        <span className="ml-2 font-medium">
          {t("barnetillegg.barn.aar.label")}
        </span>
      </span>
      <h3 className="font-bold">{`${fornavn} ${etternavn}`}</h3>
      <span>{(props as BarnType)?.fnr}</span>
      <span>
        {land
          ? t("barnetillegg.barn.land.label")
          : t("barnetillegg.barn.land.ingenregistrerte")}
        <span className="ml-2 font-bold">{land}</span>
      </span>
    </div>
  );
};

const getAlder = (fodselsdato: Date): number => {
  const today = new Date();
  const yearAge = today.getFullYear() - fodselsdato.getFullYear();
  const monthsAge = today.getMonth() - fodselsdato.getMonth();
  const dayAge = today.getDay() - fodselsdato.getDay();
  if (monthsAge < 0 || (monthsAge === 0 && dayAge < 0)) {
    return yearAge - 1;
  }
  return 1;
};

interface HiddenBarnProps {
  name: string;
  barn: BarnType;
}

const HiddenBarnFields = ({ name, barn }: HiddenBarnProps) => {
  const { register } = useFormContext();

  return (
    <div>
      <input {...register(`${name}.fnr`)} value={barn.fnr} type="hidden" />
    </div>
  );
};
