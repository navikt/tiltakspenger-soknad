export const fetchLand = () => {
  return fetch(`/api/land`).then((res) => res.json());
};
