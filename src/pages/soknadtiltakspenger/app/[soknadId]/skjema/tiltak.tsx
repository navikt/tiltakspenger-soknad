import React from "react";
import { SoknadSkjema } from "../../../../../features/soknad/SoknadSkjema";
import { TiltakVelger } from "../../../../../features/soknad/tiltaksliste/TiltakVelger";
import { getStaticProps, getStaticPaths } from "../../../../../i18n/i18n";

const Tiltak = () => {
  console.log("Render TiltakPage");

  return (
    <SoknadSkjema>
      <TiltakVelger />
    </SoknadSkjema>
  );
};

export const getServerSideProps = getStaticProps;

export default Tiltak;
