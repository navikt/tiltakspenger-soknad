import { UndocumentedBarn } from "./BarnModal";
import { useFormContext } from "react-hook-form";
import { useCallback } from "react";
import { Button } from "@navikt/ds-react";

const BarnActions = ({
  onChange,
  onDelete,
  index,
  barn,
}: {
  index: number;
  onChange: (barnIndex: number) => void;
  onDelete: (barnIndex: number) => void;
  barn: UndocumentedBarn;
}) => {
  const { setValue } = useFormContext<UndocumentedBarn>();

  const _onChange = useCallback(() => {
    setValue("fodselsdato", barn.fodselsdato);
    setValue("fornavn", barn.fornavn);
    setValue("etternavn", barn.etternavn);
    setValue("land", barn.land);
    onChange(index);
  }, [index, onChange, barn]);
  const _onDelete = useCallback(() => {
    onDelete(index);
  }, [index, onDelete, barn]);

  return (
    <div className="mt-4">
      <span className="mr-4">
        <Button type="button" onClick={_onChange} variant="secondary">
          Endre
        </Button>
      </span>
      <Button type="button" onClick={_onDelete} variant="tertiary">
        Slett
      </Button>
    </div>
  );
};

export default BarnActions;
