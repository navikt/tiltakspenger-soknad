import { useI18n } from "../i18n/i18n";
import { Button } from "@navikt/ds-react";
import { useSteps } from "./useSteps";

interface Props {
  onClick?: () => void;
  onCancel?: () => void;
  cancelUrl?: string;
  buttonTextKey?: string;
  submit?: boolean;
}

export const FooterButtons = ({
  onClick,
  buttonTextKey = "neste",
  onCancel,
  submit,
  cancelUrl,
}: Props) => {
  const t = useI18n();
  const { nextStep } = useSteps();
  const buttonProps = onClick
    ? { onClick }
    : !submit
    ? { href: nextStep?.path, as: "a" }
    : {};

  return (
    <div className="border-t pt-4 border-gray-400 flex items-start">
      <Button type={submit ? "submit" : "button"} {...buttonProps}>
        {t(buttonTextKey)}
      </Button>
      {onCancel ? (
        <Button onClick={onCancel} variant="tertiary">
          Avbryt
        </Button>
      ) : (
        <Button variant="tertiary" as={"a"} className="mt-4" href={cancelUrl}>
          {t("avbrytsoknad.knapp.tekst")}
        </Button>
      )}
    </div>
  );
};

export default FooterButtons;
