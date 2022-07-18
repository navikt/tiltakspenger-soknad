export const fetchTranslations = (locale: string): Promise<object> =>
  fetch("http://localhost:3000/api/translations").then((res) => res.json());
