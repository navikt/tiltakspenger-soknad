import React, { useCallback, useContext, useMemo } from "react";
import sanitizeHtml from "sanitize-html";
import { fetchTranslations } from "../api/translations";

export const useI18n = () => {
  const translations = useContext(TranslationContext);

  const translate = useMemo(() => {
    return (key: string) => translations[key];
  }, [translations]);
  if (!translations) throw Error("Translations not found");
  return translate;
};

export const useParsedText = () => {
  const t = useI18n();
  return (key: string) => (
    <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(t(key)) }} />
  );
};

export const getStaticProps = async (context: { locale: string }) => {
  const translations = await fetchTranslations(context.locale);
  return {
    props: {
      translations,
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [
      // if no `locale` is provided only the defaultLocale will be generated
      { params: { soknadId: "empty" }, locale: "no" },
      { params: { soknadId: "empty" }, locale: "en" },
    ],
    fallback: false,
  };
};

export const TranslationContext = React.createContext<Record<string, string>>({
  default: "defaultvalue",
});
