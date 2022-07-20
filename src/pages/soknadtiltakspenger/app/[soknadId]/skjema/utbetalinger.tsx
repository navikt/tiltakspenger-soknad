import React from "react";
import { SoknadSkjema } from "../../../../../features/soknad/SoknadSkjema";
import { Utbetalinger } from "../../../../../features/soknad/utbetalinger/Utbetalinger";
import { getStaticProps } from "../../../../../i18n/i18n";

const TrygdOgPensjonPage = () => {
  return (
    <SoknadSkjema>
      <Utbetalinger />
    </SoknadSkjema>
  );
};

export const getServerSideProps = getStaticProps;
export default TrygdOgPensjonPage;
