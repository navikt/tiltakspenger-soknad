import { useSoknadId } from "./useSoknadId";

const baseUrl = "/soknadtiltakspenger/app";

export const soknadIdParam = "[soknadId]";
const skjemaRoute = `${baseUrl}/${soknadIdParam}/skjema`;

export const startRoute = `${baseUrl}/start`;

export const routes = {
  veiledning: `${baseUrl}/${soknadIdParam}/veiledning`,
  sendinn: `${baseUrl}/${soknadIdParam}/sendinn`,
  vedlegg: `${baseUrl}/${soknadIdParam}/vedlegg`,
  skjema: {
    tiltak: `${skjemaRoute}/tiltak`,
    utbetalinger: `${skjemaRoute}/utbetalinger`,
    barnetillegg: `${skjemaRoute}/barnetillegg`,
    personalia: `${skjemaRoute}/personalia`,
    tilleggsopplysninger: `${skjemaRoute}/tilleggsopplysninger`,
  },
};

export type Routes = typeof routes;

export const useRoutes = () => {
  const soknadId = useSoknadId() || soknadIdParam;
  return replaceSoknadId(routes, soknadId);
};

export const replaceSoknadId = (routes: Routes, soknadId: string): Routes => {
  const replaceSoknadIdParam = ([key, value]: [string, string]): [
    string,
    string
  ] => [key, value.replace(soknadIdParam, soknadId)];
  const baseRoutes: Record<string, string> = (
    Object.entries(routes).filter(
      ([_, value]) => typeof value === "string"
    ) as unknown as [string, string][]
  )
    .map(replaceSoknadIdParam)
    .reduce(toMap, {});
  const skjemaRoutes: Record<string, string> = Object.entries(routes.skjema)
    .map(replaceSoknadIdParam)
    .reduce(toMap, {});

  return {
    ...baseRoutes,
    skjema: skjemaRoutes,
  } as Routes;
};

const toMap = (
  previousValue: object,
  [key, value]: [string, string]
): Record<string, string> => ({
  ...previousValue,
  [key]: value,
});
