import { useFormContext } from "react-hook-form";
import { useCallback } from "react";
import { Button } from "@navikt/ds-react";
import { BrukerRegistrertBarn } from "./BarnetilleggSkjema";

export interface BarnActionHandlers {
  onChange: (barnIndex: number) => void;
  onDelete: (barn: BrukerRegistrertBarn) => void;
}

const BarnActions = ({
  onChange,
  onDelete,
  index,
  barn,
}: BarnActionHandlers & { barn: BrukerRegistrertBarn; index: number }) => {
  const { setValue } = useFormContext<BrukerRegistrertBarn>();

  const _onChange = useCallback(() => {
    setValue("fodselsdato", barn.fodselsdato);
    setValue("fornavn", barn.fornavn);
    setValue("etternavn", barn.etternavn);
    setValue("land", barn.land);
    onChange(index);
  }, [onChange, barn]);
  const _onDelete = useCallback(() => {
    onDelete(barn);
  }, [onDelete, barn]);

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
