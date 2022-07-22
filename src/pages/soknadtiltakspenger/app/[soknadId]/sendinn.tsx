import React from "react";
import Informasjonsside from "../../../../features/veiledning/Informasjonsside";
import { getStaticPaths, getStaticProps } from "../../../../i18n/i18n";

export const getServerSideProps = getStaticProps;
export default Informasjonsside;
