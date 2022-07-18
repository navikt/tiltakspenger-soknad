import { useI18n } from "../../i18n/i18n";
import Header from "../../components/Header";
import { FC, memo, ReactNode, useCallback } from "react";
import { Button } from "@navikt/ds-react";
import SideTabs, { useSkjemaSteps } from "./SideTabs";
import { NextRouter, useRouter } from "next/router";
import {
  useForm,
  FormProvider,
  SubmitHandler,
  SubmitErrorHandler,
  UseFormReturn,
} from "react-hook-form";

interface Props {
  children: ReactNode;
  router: NextRouter;
  methods: UseFormReturn;
  nextStep: { path: string } | undefined;
  t: (t: string) => string;
}

const SoknadSkjemaRaw: FC<Props> = ({
  children,
  t,
  router,
  nextStep,
  methods,
}) => {
  const onSubmit: SubmitHandler<Record<string, string>> = useCallback(
    (thing, event) => {
      event?.preventDefault();
      console.log("=== formState ===");
      console.log("fields", thing);
      console.log("errors", methods.formState.errors);
    },
    [methods.handleSubmit]
  );

  const onError: SubmitErrorHandler<any> = useCallback((errors) => {
    console.log("==== ERROR ====");
    console.log(errors);
  }, []);

  const nextForm = async () => {
    // TODO: Validate form
    // TODO: Save form i state?

    if (!nextStep) return;
    await router.push(nextStep.path);
  };

  return (
    <div>
      <Header />
      <div className="bg-white flex justify-center border-y border-gray-300">
        <div className="mt-8 mr-8 border-r border-slate-400">
          <SideTabs />
          <div className="flex m-4 justify-center">
            <Button
              variant="secondary"
              onClick={methods.handleSubmit(onSubmit, onError)}
              data-ng-click="validerOgFinnFeilmeldinger(gaTilVedleggHvisValidert)"
            >
              {t("skjema.ferdig")}
            </Button>
          </div>
        </div>
        <form
          className="max-w-2xl w-2xl p-8"
          onSubmit={methods.handleSubmit(onSubmit, onError)}
        >
          {children}

          <div
            className="tiltakspenger"
            data-ng-form="tiltakspengerForm"
            data-novalidate
            data-ng-cloak
            data-tab-autoscroll
          >
            <div data-skjemavaliderer>
              <div data-fokus-lukket-modalside data-apne-bolker>
                <div data-sticky-feilmelding />
                <div data-sidetittel="global.sidetittel">
                  <div
                    className="soknad-accordion"
                    data-accordion
                    data-close-others="false"
                  >
                    <div
                      data-ng-repeat="bolk in bolker"
                      className="bolk js-bolk"
                      data-bolkvaliderer
                      data-bolk="bolk"
                      data-ng-form="{{bolk.id}}Form"
                      data-ng-class="{validert : bolk.validert === 'true', 'js-er-validert': bolk.validert === 'true'}"
                    >
                      <div
                        data-accordion-group
                        id="{{bolk.id}}"
                        data-is-open="bolk.apen"
                        data-validert="bolk.validert"
                      >
                        {t("{{ bolk.tittel")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {!!nextStep ? (
            <Button type="submit">
              Neste
              {/*<FooterButtons
              submit
              onClick={methods.handleSubmit(onSubmit, onError)}
            />*/}
            </Button>
          ) : undefined}
        </form>
      </div>
      <div data-sticky>
        <div data-sist-lagret data-navtilbakelenke="ingenlenke" />
      </div>
    </div>
  );
};

const areEqual = (prevProps: Props, nextProps: Props) => {
  if (prevProps.children !== nextProps.children) {
    console.log("SoknadSKjema children are NOT equal");
    return false;
  } else if (prevProps.methods !== nextProps.methods) {
    console.log("SoknadSKjema methods are NOT equal");
    return false;
  } else if (prevProps.router !== nextProps.router) {
    console.log("SoknadSKjema push are NOT equal");
    return false;
  } else if (prevProps.nextStep !== nextProps.nextStep) {
    console.log("SoknadSKjema nextStep are NOT equal");
    console.log(prevProps.nextStep, nextProps.nextStep);
    return false;
  } else if (prevProps.t !== nextProps.t) {
    console.log("SoknadSKjema t are NOT equal");
    return false;
  }
  return true;
};

const MemoSoknadSkjema = memo(SoknadSkjemaRaw, areEqual);

const Wrapper = ({ children }: { children: ReactNode }) => {
  const t = useI18n();
  const router: NextRouter = useRouter();
  const { nextStep } = useSkjemaSteps();
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <MemoSoknadSkjema
        router={router}
        methods={methods}
        nextStep={nextStep}
        t={t}
      >
        {children}
      </MemoSoknadSkjema>
    </FormProvider>
  );
};

export const SoknadSkjema = Wrapper;
