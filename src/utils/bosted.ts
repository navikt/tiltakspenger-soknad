import { Bosted } from '@/types/Spørsmålsbesvarelser';

export type Oppholdssted = 'NORGE' | 'ANNET_EØS_LAND' | 'IKKE_EØS_LAND';

export function tilOppholdssted({ borINorge, borIEøs }: Bosted): Oppholdssted | undefined {
    if (borINorge === true) return 'NORGE';
    if (borINorge === false && borIEøs === true) return 'ANNET_EØS_LAND';
    if (borINorge === false && borIEøs === false) return 'IKKE_EØS_LAND';
    return undefined;
}

export function harSvartPåBosted(bosted: Bosted | undefined): boolean {
    return !!bosted && tilOppholdssted(bosted) !== undefined;
}
