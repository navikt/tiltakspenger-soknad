import React from "react";
import Veiledning from "../../../../features/veiledning/Veiledning";
import { getStaticPaths, getStaticProps } from "../../../../i18n/i18n";

export const getServerSideProps = getStaticProps;
export default Veiledning;
