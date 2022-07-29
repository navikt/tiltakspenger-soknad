const base = "http://127.0.0.1:8181/sendsoknad";

export const apiUrls = {
  soknad: base + "/soknader",
  postFakta: base + "/fakta",
  getFakta: (soknadId: string) => `${apiUrls.soknad}/${soknadId}/fakta`,
  deleteFakta: (faktaId: string) => `${apiUrls.postFakta}/${faktaId}`,
};
