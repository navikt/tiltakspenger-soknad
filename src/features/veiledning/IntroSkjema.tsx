import React from "react";
import Skjema from "../../components/skjema/Skjema";
import { dateFieldValidator } from "../../components/skjema/DateField";

const IntroSkjema = () => {
  return (
    <div>
      <Skjema
        fields={[
          {
            type: "fratil",
            name: "introDates",
            fraLabel: "informasjonsside.introprogram.deltar.dato.fra",
            tilLabel: "informasjonsside.introprogram.deltar.dato.til",
            validations: {
              fra: dateFieldValidator("asdfsa"),
              til: (t) => ({
                valueAsDate: true,
              }),
            },
          },
        ]}
      />
    </div>
  );
};

export default IntroSkjema;
