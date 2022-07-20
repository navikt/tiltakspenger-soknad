import { DeepRequired, FieldErrorsImpl, Merge } from "react-hook-form";
import { FieldError } from "react-hook-form/dist/types/errors";

export const getFieldError = function <FieldValues>(
  fieldName: string,
  errors: FieldErrorsImpl<DeepRequired<FieldValues>> | undefined
): FieldError | undefined {
  if (!errors) return undefined;
  const [first, ...tail] = fieldName.split(".") as unknown as [
    keyof FieldValues
  ];
  if (tail.length === 0) return errors[first] as FieldError;

  return getFieldError(
    tail.join("."),
    errors[first] as FieldErrorsImpl<DeepRequired<FieldValues>>
  );
};
