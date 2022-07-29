import { PersistedFormValues } from "../features/soknad/felles/SkjemaPersistanceProvider";
import { FaktaKey, Faktum } from "./FaktumTypes";

export const skjemaToFakta = (fakta: Faktum[]): PersistedFormValues => {
  // TODO: Map out all faktums to fields in schema
  return {
    "Andre utbetalinger": {},
    Barnetillegg: {},
    Personalia: {},
    Tilleggsopplysninger: {},
    Tiltak: {},
    veiledning: {
      inst: find(fakta, "informasjonsside.institusjon")?.value === "ja",
      kvp:
        find(fakta, "informasjonsside.kvalifiseringsprogram")?.value === "ja",
      intro:
        find(fakta, "informasjonsside.deltarIIntroprogram")?.value === "ja",
    },
  };
};

export const typedFaktaFilter =
  <FaktaKeyValue extends FaktaKey>(discriminantValue: FaktaKeyValue) =>
  (faktum: Faktum): faktum is Extract<Faktum, { key: FaktaKeyValue }> =>
    faktum.key === discriminantValue;

const find = <T extends FaktaKey>(fakta: Faktum[], key: T) =>
  fakta.find(typedFaktaFilter(key));
