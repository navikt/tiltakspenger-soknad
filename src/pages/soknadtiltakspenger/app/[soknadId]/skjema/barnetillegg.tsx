import React from "react";
import { SoknadSkjema } from "../../../../../features/soknad/felles/SoknadSkjema";
import { BarnetilleggSkjema } from "../../../../../features/soknad/barnetillegg/BarnetilleggSkjema";
import { getStaticProps } from "../../../../../i18n/i18n";

const BarnetilleggPage = () => {
  return (
    <SoknadSkjema>
      <BarnetilleggSkjema />
    </SoknadSkjema>
  );
};

export const getServerSideProps = getStaticProps;
export default BarnetilleggPage;
