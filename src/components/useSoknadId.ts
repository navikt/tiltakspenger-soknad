import { useRouter } from "next/router";

export const useSoknadId = () => {
  const router = useRouter();
  const soknadId = router.query.soknadId;
  return soknadId as string | undefined;
};
