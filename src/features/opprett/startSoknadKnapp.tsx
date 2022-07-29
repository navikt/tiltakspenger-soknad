import { useRouter } from "next/router";
import FooterButtons from "../../components/FooterButtons";
import { soknadIdParam, useRoutes } from "../../components/useRoutes";
import { opprettSoknad } from "../../api/soknad";

export const StartSoknadKnapp = () => {
  const router = useRouter();
  const routes = useRoutes();

  const goToNextPage = async () => {
    const { brukerBehandlingId: soknadId } = await opprettSoknad();
    await router.push(routes.veiledning.replace(soknadIdParam, soknadId));
  };

  return (
    <FooterButtons
      onClick={goToNextPage}
      buttonTextKey={"startsoknad.knapp.tekst"}
    />
  );
};
