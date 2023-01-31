import { UNSAFE_DatePicker, UNSAFE_useRangeDatepicker } from "@navikt/ds-react";
import { DateRange } from "react-day-picker";

interface PeriodevelgerProps {
  onRangeChange: (periode: DateRange | undefined) => void;
}

export default function Periodevelger({ onRangeChange }: PeriodevelgerProps) {
  const { datepickerProps, toInputProps, fromInputProps } =
    UNSAFE_useRangeDatepicker({
      onRangeChange,
    });

  return (
    <UNSAFE_DatePicker {...datepickerProps}>
      <UNSAFE_DatePicker.Input {...fromInputProps} size="small" label="Fra" />
      <UNSAFE_DatePicker.Input {...toInputProps} size="small" label="Til" />
    </UNSAFE_DatePicker>
  );
}
