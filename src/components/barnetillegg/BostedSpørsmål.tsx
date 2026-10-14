import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Link } from '@navikt/ds-react';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import JaNeiSpørsmål from '@/components/ja-nei-spørsmål/JaNeiSpørsmål';
import { påkrevdJaNeiSpørsmålValidator } from '@/utils/formValidators';
import { formaterBarnetsNavn, Navnedeler } from '@/utils/barnetsNavn';

interface BostedSpørsmålProps {
    /** Navnet på barnet slik det skal stå i spørsmålene. */
    barnetsNavn: string;
    borINorgeName: string;
    borIEøsName: string;
    /** Modalen holder feltene montert når den er lukket, og må da kunne skru av valideringen. */
    skalValideres?: () => boolean;
}

/** Navnet slik det skal stå inne i et spørsmål, med «barnet» når ingen deler av navnet er kjent. */
export function navnPåBarnet(barn: Navnedeler) {
    return formaterBarnetsNavn(barn) ?? 'barnet';
}

export default function BostedSpørsmål({
    barnetsNavn,
    borINorgeName,
    borIEøsName,
    skalValideres = () => true,
}: BostedSpørsmålProps) {
    const { watch, setValue } = useFormContext();
    const borINorge = watch(borINorgeName);

    function borINorgeValidator(verdi: boolean) {
        if (!skalValideres()) return;
        return påkrevdJaNeiSpørsmålValidator(verdi, `Du må svare på om ${barnetsNavn} bor i Norge`);
    }

    function borIEøsValidator(verdi: boolean) {
        if (!skalValideres()) return;
        return påkrevdJaNeiSpørsmålValidator(verdi, `Du må svare på om ${barnetsNavn} bor i et EØS-land`);
    }

    return (
        <>
            <JaNeiSpørsmål
                reverse
                name={borINorgeName}
                validate={borINorgeValidator}
                afterOnChange={() => setValue(borIEøsName, undefined)}
                hjelpetekst={{
                    tittel: 'Hvorfor spør vi om dette?',
                    tekst: 'Hvis barnet ditt bor utenfor EØS, kan det ha betydning for din rett til barnetillegg.',
                }}
            >
                Bor {barnetsNavn} i Norge?
            </JaNeiSpørsmål>
            {borINorge === false && (
                <JaNeiSpørsmål
                    reverse
                    name={borIEøsName}
                    validate={borIEøsValidator}
                    hjelpetekst={{
                        tittel: 'Hvilke land er i EØS?',
                        tekst: (
                            <>
                                <span>
                                    Det er totalt 30 land som er med i EØS: de 27 medlemslandene i EU, samt de tre
                                    EFTA-landene Norge, Island og Liechtenstein.
                                </span>
                                <span style={{ display: 'block', marginTop: '1rem' }}>
                                    <Link
                                        href="https://www.nav.no/no/person/flere-tema/arbeid-og-opphold-i-utlandet/relatert-informasjon/eos-landene"
                                        target="_blank"
                                    >
                                        Du kan lese mer om hvilke land som er med i EØS her (åpnes i ny fane)
                                        <ExternalLinkIcon aria-hidden />
                                    </Link>
                                </span>
                            </>
                        ),
                    }}
                >
                    Bor {barnetsNavn} i et EØS-land?
                </JaNeiSpørsmål>
            )}
        </>
    );
}
