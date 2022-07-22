import React from "react";
import { SoknadSkjema } from "../../../../../features/soknad/felles/SoknadSkjema";
import { Barnetillegg } from "../../../../../features/soknad/barnetillegg/templates/Barnetillegg";
import { getStaticProps, getStaticPaths } from "../../../../../i18n/i18n";

const BarnetilleggPage = () => {
  return (
    <SoknadSkjema>
      <Barnetillegg />
    </SoknadSkjema>
  );
};

export const getServerSideProps = getStaticProps;
export default BarnetilleggPage;
