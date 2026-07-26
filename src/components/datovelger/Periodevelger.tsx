import { DatePicker, ErrorMessage, useDatepicker } from '@navikt/ds-react';
import { useId } from 'react';
import { DATOFORMAT_BESKRIVELSE } from '@/components/datovelger/datoFeilmelding';
import { useDatofeil } from '@/components/datovelger/useDatofeil';

export interface PeriodevelgerPeriode {
    fra?: Date;
    til?: Date;
}

interface PeriodevelgerProps {
    onFromChange: (date: Date | undefined) => void;
    onToChange: (date: Date | undefined) => void;
    defaultSelected?: PeriodevelgerPeriode | null;
    errorMessage?: string;
    id?: string;
    minDate?: Date;
    maxDate?: Date;
    disabledFra?: boolean;
    disabledTil?: boolean;
}

const erSatt = (feilmelding?: string): feilmelding is string => !!feilmelding;

export default function Periodevelger({
    onFromChange,
    onToChange,
    defaultSelected,
    errorMessage,
    id,
    minDate,
    maxDate,
    disabledFra,
    disabledTil,
}: PeriodevelgerProps) {
    const grenser = { fraDato: minDate, tilDato: maxDate };
    const fraFeil = useDatofeil({ feltnavn: 'Fra-dato', ...grenser }, !!errorMessage);
    const tilFeil = useDatofeil({ feltnavn: 'Til-dato', ...grenser }, !!errorMessage);

    const fraDatepicker = useDatepicker({
        onDateChange: onFromChange,
        defaultSelected: defaultSelected?.fra,
        fromDate: minDate,
        toDate: maxDate,
        defaultMonth: minDate ?? maxDate,
        onValidate: fraFeil.onValidate,
    });

    const tilDatepicker = useDatepicker({
        onDateChange: onToChange,
        defaultSelected: defaultSelected?.til,
        fromDate: minDate,
        toDate: maxDate,
        defaultMonth: maxDate ?? minDate,
        onValidate: tilFeil.onValidate,
    });

    // Feilmeldingene ligger utenfor feltene fordi skjemafeilen gjelder perioden som helhet,
    // og kobles på med aria-describedby — ellers når de ikke skjermlesere.
    // Se Aksels «Input range with error».
    const reserveId = useId();
    const feilmeldingsId = `${id ?? reserveId}-feilmelding`;
    // Sett, ikke liste: skjemafeilen kan si det samme som datofeilen, og da holder det én gang.
    const feilmeldinger = [...new Set([fraFeil.feilmelding, tilFeil.feilmelding, errorMessage].filter(erSatt))];
    const beskrivesAvFeilmelding = feilmeldinger.length > 0 ? feilmeldingsId : undefined;
    // dropdownCaption krever både fromDate og toDate for å gi nedtrekk for år og måned.
    const harNedtrekk = !!minDate && !!maxDate;

    return (
        <>
            <div style={{ display: 'flex', gap: '1rem', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
                <DatePicker {...fraDatepicker.datepickerProps} dropdownCaption={harNedtrekk}>
                    <DatePicker.Input
                        {...fraDatepicker.inputProps}
                        onBlur={(event) => {
                            fraDatepicker.inputProps.onBlur?.(event);
                            fraFeil.markerSomBerørt();
                        }}
                        id={id ? `${id}.fra` : undefined}
                        label="Fra"
                        description={DATOFORMAT_BESKRIVELSE}
                        // Bare feltet som faktisk er feil skal markeres. Skjemafeilen gjelder
                        // perioden, og markerer derfor begge.
                        error={!!fraFeil.feilmelding || !!errorMessage}
                        aria-describedby={beskrivesAvFeilmelding}
                        disabled={disabledFra}
                    />
                </DatePicker>
                <DatePicker {...tilDatepicker.datepickerProps} dropdownCaption={harNedtrekk}>
                    <DatePicker.Input
                        {...tilDatepicker.inputProps}
                        onBlur={(event) => {
                            tilDatepicker.inputProps.onBlur?.(event);
                            tilFeil.markerSomBerørt();
                        }}
                        id={id ? `${id}.til` : undefined}
                        label="Til"
                        description={DATOFORMAT_BESKRIVELSE}
                        error={!!tilFeil.feilmelding || !!errorMessage}
                        aria-describedby={beskrivesAvFeilmelding}
                        disabled={disabledTil}
                    />
                </DatePicker>
            </div>
            <div id={feilmeldingsId} aria-live="polite">
                {feilmeldinger.map((feilmelding) => (
                    <ErrorMessage key={feilmelding} size="small" showIcon>
                        {feilmelding}
                    </ErrorMessage>
                ))}
            </div>
        </>
    );
}
