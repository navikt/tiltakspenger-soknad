import { useI18n } from "../i18n/i18n";
import { Button } from "@navikt/ds-react";
import { useSteps } from "./useSteps";

interface Props {
  onClick?: () => void;
  onCancel?: () => void;
  buttonTextKey?: string;
}

export const FooterButtons = ({
  onClick,
  buttonTextKey = "neste",
  onCancel,
}: Props) => {
  const t = useI18n();
  const { nextUrl } = useSteps();
  const buttonProps = onClick ? { onClick } : { href: nextUrl, as: "a" };

  return (
    <div className="border-t pt-4 border-gray-400 flex flex-col">
      <Button {...buttonProps}>{t(buttonTextKey)}</Button>
      {onCancel ? (
        <Button onClick={onCancel} variant="tertiary">
          Avbryt
        </Button>
      ) : (
        <a className="mt-4" href="{{dittnavUrl}}">
          {t("avbrytsoknad.knapp.tekst")}
        </a>
      )}
    </div>
  );
};

export default FooterButtons;
