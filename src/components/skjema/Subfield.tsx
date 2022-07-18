import React, { ReactElement, useEffect, useState } from "react";
import { SelfRegisterProps, useRequiredFields } from "./requires";
import { useFormContext } from "react-hook-form";

interface Props extends SelfRegisterProps {
  children: ReactElement;
}

const Subfield = ({ children }: Props) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="overflow-hidden pt-4">
      <div
        className={
          "bg-stone-100 p-4 border border-gray-400 relative transition ease-in-out " +
          (isMounted ? "" : preMountClass)
        }
      >
        <div className="border-[16px] border-transparent border-b-gray-400 absolute h-0 w-0 -top-[33px]" />
        <div className="border-[18px] border-transparent border-b-stone-100 absolute h-0 w-0 -top-[33px] left-[14px]" />
        {children}
      </div>
    </div>
  );
};

const preMountClass = "translate-y-[-500px]";

const ShouldRenderWrapper = ({ children, ...props }: Props) => {
  const { watch } = useFormContext();
  const shouldRender = useRequiredFields(watch, props.requireFields);
  if (!shouldRender) return null;
  return <Subfield {...props}>{children}</Subfield>;
};

export default ShouldRenderWrapper;
