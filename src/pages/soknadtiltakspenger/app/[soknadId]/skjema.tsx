import React, { useEffect } from "react";
import { SoknadSkjema } from "../../../../features/soknad/SoknadSkjema";
import { getStaticProps } from "../../../../i18n/i18n";
import { useRouter } from "next/router";
import { useRoutes } from "../../../../components/useRoutes";
import { Loader } from "@navikt/ds-react";

const SkjemaRedirectPage = () => {
  const router = useRouter();
  const routes = useRoutes();
  useEffect(() => {
    router.push(routes.skjema.tiltak);
  }, []);
  return (
    <SoknadSkjema>
      <Loader />
    </SoknadSkjema>
  );
};

export const getServerSideProps = getStaticProps;
export default SkjemaRedirectPage;
