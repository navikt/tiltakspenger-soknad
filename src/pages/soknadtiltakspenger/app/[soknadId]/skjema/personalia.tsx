import React from "react";
import { SoknadSkjema } from "../../../../../features/soknad/felles/SoknadSkjema";
import Personalia from "../../../../../features/soknad/Personalia";
import { getStaticProps, getStaticPaths } from "../../../../../i18n/i18n";

const PersonaliaPage = () => {
  return (
    <SoknadSkjema>
      <Personalia />
    </SoknadSkjema>
  );
};

export const getServerSideProps = getStaticProps;
export default PersonaliaPage;
