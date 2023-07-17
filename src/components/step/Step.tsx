import React from 'react';
import { Button, ErrorSummary, GuidePanel, Heading } from '@navikt/ds-react';
import { useFormContext } from 'react-hook-form';
import styles from './Step.module.css';
import findAllErrors from '@/utils/errorState';
import CustomGuidePanel from '@/components/custom-guide-panel/CustomGuidePanel';

interface StepProps {
    title: string;
    onCompleted?: () => void;
    onGoToPreviousStep: () => void;
    children: React.ReactNode;
    stepNumber: number;
    submitSectionRenderer?: undefined | (() => React.ReactNode);
    guide?: string | React.ReactNode;
    hideStepIndicator?: boolean;
    hideTitle?: boolean;
}

export default function Step({
    title,
    children,
    onCompleted,
    onGoToPreviousStep,
    stepNumber,
    submitSectionRenderer,
    guide,
    hideStepIndicator,
    hideTitle,
}: StepProps) {
    const {
        clearErrors,
        handleSubmit,
        formState: { submitCount, errors },
    } = useFormContext();

    const errorRef = React.useRef(null);
    function focusErrorSummary() {
        errorRef?.current && (errorRef.current as any).focus();
    }

    React.useEffect(focusErrorSummary, [submitCount]);

    const shouldRenderCustomSubmitSection = !!submitSectionRenderer;

    const allErrors = findAllErrors(errors || [], []);
    const shouldShowErrorSummary = submitCount > 0 && allErrors && allErrors.length > 0;

    const totalStep = 6;

    function goToPreviousStepHandler() {
        clearErrors();
        onGoToPreviousStep();
    }

    return (
        <>
            {!hideTitle && (
                <Heading size="large" level="1" style={{ textAlign: 'center' }}>
                    {title}
                </Heading>
            )}
            {shouldShowErrorSummary && (
                <ErrorSummary
                    className={styles.step__errorsummary}
                    ref={errorRef}
                    heading="Du må fikse disse feilene før du kan fortsette:"
                >
                    {allErrors.map(({ message, ref, type, types, root }) => {
                        return (
                            <ErrorSummary.Item key={ref!.name} href={`#${ref!.name}`}>
                                {message}
                            </ErrorSummary.Item>
                        );
                    })}
                </ErrorSummary>
            )}
            {!hideStepIndicator && (
                <span className={styles.step__stepindicator}> {`Steg ${stepNumber} av ${totalStep}`} </span>
            )}
            {guide && <CustomGuidePanel poster>{guide}</CustomGuidePanel>}
            <form onSubmit={onCompleted ? handleSubmit(onCompleted) : () => {}}>
                <>
                    {children}
                    {shouldRenderCustomSubmitSection ? (
                        (submitSectionRenderer as any)()
                    ) : (
                        <div className={styles.step__buttonsection}>
                            <Button type="button" size="small" variant="secondary" onClick={goToPreviousStepHandler}>
                                Forrige steg
                            </Button>
                            <Button type="submit" size="small">
                                Neste steg
                            </Button>
                        </div>
                    )}
                </>
            </form>
        </>
    );
}
