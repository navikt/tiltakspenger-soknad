import { useRouter } from "next/router";
import FooterButtons from "../../components/FooterButtons";
import { soknadIdParam, useRoutes } from "../../components/useRoutes";

export const StartSoknadKnapp = () => {
  const router = useRouter();
  const id = "echuql";
  const routes = useRoutes();

  const goToNextPage = async () => {
    await router.push(routes.veiledning.replace(soknadIdParam, id));
  };

  return (
    <FooterButtons
      onClick={goToNextPage}
      buttonTextKey={"startsoknad.knapp.tekst"}
    />
  );
};
