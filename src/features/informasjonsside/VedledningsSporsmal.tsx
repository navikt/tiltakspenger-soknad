import Question from "../../components/Question";

export const VedledningsSporsmal = () => {
  return (
    <fieldset className="skjema-fieldset blokk">
      <Question
        name={"veiledning.kvp"}
        label={"informasjonsside.kvalifiseringsprogram.tittel"}
        infoTextKey={"informasjonsside.kvalifiseringsprogram.informasjon"}
        title={"informasjonsside.kvalifiseringsprogram.tittel"}
        trueTextKey={"informasjonsside.kvalifiseringsprogram.ja"}
        falseTextKey={"informasjonsside.kvalifiseringsprogram.nei"}
      />
      <Question
        name={"veiledning.inst"}
        label={"informasjonsside.institusjon.tittel"}
        infoTextKey={"informasjonsside.institusjon.informasjon"}
        title={"informasjonsside.institusjon.tittel"}
        trueTextKey={"informasjonsside.institusjon.ja"}
        falseTextKey={"informasjonsside.institusjon.nei"}
      />
      <div
        className="blokk"
        data-ng-if="informasjonssideController.oppfyllerIntroprogramKriterier()"
      >
        <Question
          name={"veiledning.intro"}
          label={"informasjonsside.introprogram.overskrift"}
          infoTextKey={"informasjonsside.introprogram.tekst"}
          title={"informasjonsside.introprogram.overskrift"}
          trueTextKey={"informasjonsside.introprogram.false"}
          falseTextKey={"informasjonsside.introprogram.true"}
        />
      </div>
    </fieldset>
  );
};
