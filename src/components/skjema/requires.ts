import { UseFormWatch } from "react-hook-form";

export type RequiredFields<T extends string = string> = Record<
  T,
  string | boolean | undefined
>;

export const watchFields = (
  watch: UseFormWatch<any>,
  requireFields?: RequiredFields
) => {
  return requireFields
    ? Object.keys(requireFields).reduce(
        (acc, field) => ({ ...acc, [field]: watch(field) }),
        {} as RequiredFields
      )
    : ({} as RequiredFields);
};

export const conditionsAreMet = (
  watched: Record<string, any>,
  requireFields?: RequiredFields
) => {
  return !!requireFields
    ? Object.entries(requireFields).every(
        ([key, value]) => watched[key] === value
      )
    : true;
};

export const useRequiredFields = (
  watch: UseFormWatch<any>,
  requireFields?: RequiredFields
) => {
  if (!requireFields) return true;
  const watched = watchFields(watch, requireFields);
  console.log({ watched });
  const shouldRender = conditionsAreMet(watched, requireFields);
  return shouldRender;
};

export interface SelfRegisterProps<T extends string = string> {
  name: string;
  label: string;
  requireFields?: RequiredFields<T>;
}
