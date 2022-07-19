import React from "react";
import { SoknadSkjema } from "../../../../../features/soknad/SoknadSkjema";
import { TiltakVelger } from "../../../../../features/soknad/tiltaksliste/TiltakVelger";
import { getStaticProps } from "../../../../../i18n/i18n";

const Tiltak = () => {
  return (
    <SoknadSkjema>
      <TiltakVelger />
    </SoknadSkjema>
  );
};

export const getServerSideProps = getStaticProps;

export default Tiltak;
