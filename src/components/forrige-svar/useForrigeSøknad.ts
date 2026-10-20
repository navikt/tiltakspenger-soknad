import { use, useMemo } from 'react';
import { UtfyllingContext } from '@/pages/utfylling/[[...step]]';
import { TidligereSøknad } from '@/types/Tiltak';
import { kortSvar, oppsummerSvar, Svaroppsummering } from '@/utils/svaroppsummering';

export interface ForrigeSøknad {
    søknad: TidligereSøknad;
    oppsummering: Svaroppsummering;
    /** «Ja» med eventuell periode eller dato, eller «Nei», for markørene i hvert steg. */
    kortSvar: Svaroppsummering;
}

/** Den sist mottatte søknaden for det valgte tiltaket, som den nye søknaden er fylt ut fra og sammenlignes med. */
export function useForrigeSøknad(): ForrigeSøknad | undefined {
    const { valgtTiltak } = use(UtfyllingContext);
    const søknad = valgtTiltak?.tidligereSøknad ?? undefined;
    return useMemo(
        () =>
            søknad ? { søknad, oppsummering: oppsummerSvar(søknad.svar), kortSvar: kortSvar(søknad.svar) } : undefined,
        [søknad],
    );
}
