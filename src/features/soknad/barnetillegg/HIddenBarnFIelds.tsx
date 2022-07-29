import { BarnType } from "./BarnetilleggSkjema";
import { useFormContext } from "react-hook-form";

interface HiddenBarnProps {
  name: string;
  barn: BarnType;
}

const HiddenBarnFields = ({ name, barn }: HiddenBarnProps) => {
  const { register } = useFormContext();

  return (
    <div>
      <input {...register(`${name}.fnr`)} value={barn.faktumId} type="hidden" />
    </div>
  );
};

export default HiddenBarnFields;
