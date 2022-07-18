import React from "react";
import { getStaticProps, getStaticPaths } from "../../../../i18n/i18n";
import VedleggsPage from "../../../../features/vedlegg/VedleggsPage";

export const getServerSideProps = getStaticProps;
export default VedleggsPage;
