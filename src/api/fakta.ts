export const fetchFakta = (soknadId: string) => {
  return fetch(`/api/fakta`).then((res) => res.json());
};
