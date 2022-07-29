const payload = { soknadType: "NAV 76-13.45" };

const soknadAPIUrl = "/api/soknad";

interface PostSoknadResponse {
  brukerBehandlingId: string;
}

export const opprettSoknad = (): Promise<PostSoknadResponse> => {
  return fetch(soknadAPIUrl, {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((res) => res.json());
};
