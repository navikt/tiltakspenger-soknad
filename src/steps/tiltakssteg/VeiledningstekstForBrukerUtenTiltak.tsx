import React from 'react';
import { Link } from '@navikt/ds-react';

export default () => {
    return (
        <>
            <p>For å ha rett til tiltakspenger må du delta i et arbeidsmarkedstiltak som er godkjent av NAV. </p>
            <p>
                Det er ikke registrert at du er påmeldt, deltar på eller nylig har deltatt på et arbeidsmarkedstiltak
                som gir rett til tiltakspenger.
            </p>
            <span>Hvis du mener dette ikke er riktig kan du </span>
            <ul>
                <li>
                    <Link href="https://www.nav.no/kontaktoss" target="_blank">
                        Kontakte oss (åpnes i ny fane)
                    </Link>
                </li>
                <li>Vente noen dager og prøve igjen</li>
                <li>
                    <Link href="https://www.nav.no/fyllut/nav761345?sub=paper" target="_blank">
                        Sende søknad på papir (åpnes i ny fane)
                    </Link>
                </li>
            </ul>
        </>
    );
};
