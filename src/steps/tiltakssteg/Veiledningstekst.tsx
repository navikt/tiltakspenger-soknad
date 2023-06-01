import React from 'react';
import VeiledningstekstForBrukerMedTiltak from '@/steps/tiltakssteg/VeiledningstekstForBrukerMedTiltak';
import VeiledningstekstForBrukerUtenTiltak from '@/steps/tiltakssteg/VeiledningstekstForBrukerUtenTiltak';

interface VeiledningstekstProps {
    brukerHarRegistrerteTiltak: boolean;
}

export default ({ brukerHarRegistrerteTiltak }: VeiledningstekstProps) => {
    if (brukerHarRegistrerteTiltak) {
        return <VeiledningstekstForBrukerMedTiltak />;
    }
    return <VeiledningstekstForBrukerUtenTiltak />;
};
