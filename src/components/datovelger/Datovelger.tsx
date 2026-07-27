import { DatePicker, useDatepicker } from '@navikt/ds-react';
import { useDatofeil } from '@/components/datovelger/useDatofeil';

interface DatovelgerProps {
    onDateChange: (date: Date | undefined) => void;
    errorMessage?: string;
    id?: string;
    /** Nedre grense for hva som godtas. Skriver brukeren noe før denne, forkastes datoen og feltet viser feil. */
    minDate?: Date;
    maxDate?: Date;
    /**
     * Nedre grense for kalenderen og år-nedtrekket, når det ikke er det samme som hva vi godtar.
     * Aksel bruker samme `fromDate` til begge deler, så et nedtrekk med hundre årstall er prisen for å godta hundre år.
     * Settes denne, kortes lista ned til det brukeren normalt trenger, mens eldre datoer fortsatt kan skrives inn manuelt.
     */
    kalenderFraDato?: Date;
    label: string;
    description?: string;
    datoMåVæreIFortid?: boolean;
    defaultMonth?: Date;
    defaultSelected?: Date;
}

export default function Datovelger({
    onDateChange,
    errorMessage,
    id,
    label,
    description,
    maxDate,
    minDate,
    kalenderFraDato,
    datoMåVæreIFortid,
    defaultMonth,
    defaultSelected,
}: DatovelgerProps) {
    // Grensen skal følge dagens dato: står fanen åpen over midnatt, må brukeren fortsatt få lov
    // til å skrive inn dagens dato. Derfor hverken memoisert eller lagt i state — begge deler
    // ville frosset grensen ved montering. Aksel sammenligner på kalenderdag, så klokkeslettet
    // spiller ingen rolle.
    // eslint-disable-next-line @eslint-react/purity -- bevisst: se kommentaren over
    const tilDato = datoMåVæreIFortid ? new Date() : maxDate;

    const { onValidate, markerSomBerørt, feilmelding } = useDatofeil(
        { feltnavn: label, fraDato: minDate, tilDato, datoMåVæreIFortid },
        !!errorMessage,
    );

    const { datepickerProps, inputProps } = useDatepicker({
        onDateChange,
        fromDate: minDate,
        toDate: tilDato,
        defaultMonth,
        defaultSelected,
        onValidate,
    });

    // useDatepicker og DatePicker leser hver sin fromDate: den første avgjør hva som godtas,
    // den andre hva kalenderen og nedtrekket viser. Uten kalenderFraDato er de like, som før.
    const kalenderFraDatoEllerMinDate = kalenderFraDato ?? minDate;

    return (
        // dropdownCaption krever både fromDate og toDate for å gi nedtrekk for år og måned.
        // id skal bare på inputen, ikke her — DatePicker bruker den som aria-id for popoveren.
        <DatePicker
            {...datepickerProps}
            fromDate={kalenderFraDatoEllerMinDate}
            dropdownCaption={!!kalenderFraDatoEllerMinDate && !!tilDato}
        >
            <DatePicker.Input
                {...inputProps}
                onBlur={(event) => {
                    inputProps.onBlur?.(event);
                    markerSomBerørt();
                }}
                id={id}
                label={label}
                description={description}
                error={feilmelding ?? errorMessage}
            />
        </DatePicker>
    );
}
