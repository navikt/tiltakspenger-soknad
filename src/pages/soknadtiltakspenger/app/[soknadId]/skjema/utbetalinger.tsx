import React from "react";
import { SoknadSkjema } from "../../../../../features/soknad/SoknadSkjema";
import { TrygdOgPensjon } from "../../../../../features/soknad/trygdogpensjon/trygdOgPensjonTemplate";
import { getStaticProps } from "../../../../../i18n/i18n";

const TrygdOgPensjonPage = () => {
  return (
    <SoknadSkjema>
      <TrygdOgPensjon />
    </SoknadSkjema>
  );
};

export const getServerSideProps = getStaticProps;
export default TrygdOgPensjonPage;
