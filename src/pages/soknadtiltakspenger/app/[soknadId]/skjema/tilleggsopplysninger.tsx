import React from "react";
import { SoknadSkjema } from "../../../../../features/soknad/SoknadSkjema";
import Tilleggsopplysninger from "../../../../../features/soknad/Tilleggsopplysninger";
import { getStaticProps, getStaticPaths } from "../../../../../i18n/i18n";

const Tillegg = () => {
  return (
    <SoknadSkjema>
      <Tilleggsopplysninger />
    </SoknadSkjema>
  );
};

export const getServerSideProps = getStaticProps;
export default Tillegg;
