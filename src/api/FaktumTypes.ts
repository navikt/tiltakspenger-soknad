export type Faktum =
  | KVPFaktum
  | InstFaktum
  | InstHvaSlagsFakrum
  | IntroFaktum
  | AnnetTiltakFaktum
  | HarUtebtalingFaktum
  | UtbetalerFaktum
  | FritekstFaktum
  | BarnFakta;

export type FaktaKey = Faktum["key"];

export type FaktumProperties =
  | AnnetTiltakFaktumProperties
  | BrukerRegistertBarnFaktumProperties
  | UtbetalerFaktumProperties;

interface BaseFaktum {
  faktumEgenskaper: []; // Only found in "barn"-fakta
  faktumId: number;
  parrentFaktum: number | null;
  soknadId: number;
  type: "BRUKERREGISTRERT" | "SYSTEMREGISTRERT";
}

type DateString = string;
type NorskBool = "ja" | "nei";
type BoolString = "false" | "true";

interface KVPFaktum extends BaseFaktum {
  key: "informasjonsside.kvalifiseringsprogram";
  value: NorskBool;
}
interface InstFaktum extends BaseFaktum {
  key: "informasjonsside.institusjon";
  value: NorskBool;
}
interface InstHvaSlagsFakrum extends BaseFaktum {
  key: "informasjonsside.institusjon.ja.hvaslags";
  value: "overgangsbolig" | "barneverninstitusjon";
}
interface IntroFaktum extends BaseFaktum {
  key: "informasjonsside.deltarIIntroprogram";
  value: NorskBool;
}
interface AnnetTiltakFaktum extends BaseFaktum {
  key: "tiltaksliste.annetTiltak";
  properties: AnnetTiltakFaktumProperties;
  value: "AMO" | "PRAKSORD" | "JOBSOK" | "Annet";
}
interface HarUtebtalingFaktum extends BaseFaktum {
  key: "trygdogpensjon";
  value: BoolString;
}
interface UtbetalerFaktum extends BaseFaktum {
  key: "trygdogpensjon.utbetalere";
  properties: UtbetalerFaktumProperties;
}
interface FritekstFaktum extends BaseFaktum {
  key: "tilleggsopplysninger.fritekst";
  value: string;
}
interface BarnFakta extends BaseFaktum {
  key: "barn";
  properties:
    | SystemRegistrertBarnFaktumProperties
    | BrukerRegistertBarnFaktumProperties;
}

interface SystemRegistrertBarnFaktumProperties {
  alder: string;
  etternavn: string;
  fnr: string;
  fornavn: string;
  kjonn: "k" | "m";
  land: string;
  mellomnavn: null | string;
  sammensattnavn: string;
  sokerbarnetillegg: NorskBool | null;
  uniqueKey: "fnr";
}

export interface BrukerRegistertBarnFaktumProperties {
  alder: number;
  etternavn: string;
  fodselsdato: DateString;
  fornavn: string;
  land: string;
  sokerbarnetillegg: NorskBool | null;
}

export interface UtbetalerFaktumProperties {
  fom: DateString;
  prosent: string;
  tom: DateString;
  utbetaler: string;
}

export interface AnnetTiltakFaktumProperties {
  adresse: string;
  // Yes, backend expects antallDager in string format, ex "3 dager"
  antallDager: string;
  arrangoernavn: string;
  postnummer: string;
  beskrivelse: string;
}
