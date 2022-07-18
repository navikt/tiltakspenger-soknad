import { useRouter } from "next/router";
import FooterButtons from "../../../components/FooterButtons";
import { soknadBasePath } from "../../../routing";

export const StartSoknadKnapp = () => {
  const router = useRouter();
  const id = "echuql";

  const goToNextPage = async () => {
    await router.push(`${soknadBasePath(id)}/tiltak`);
  };

  return (
    <FooterButtons
      onClick={goToNextPage}
      buttonTextKey={"startsoknad.knapp.tekst"}
    />
  );
};
