import React from 'react';
import { ErrorMessage, FileUpload, VStack } from '@navikt/ds-react';
import type { FilesPartitioned } from '@navikt/ds-react';
import { Control, useFieldArray } from 'react-hook-form';
import Søknad from '@/types/Søknad';
import {
    feilmeldingForAntall,
    feilmeldingForAvvistFil,
    feilmeldingForTotalStørrelse,
    GODKJENTE_FILTYPER,
    MAKS_ANTALL_VEDLEGG,
    MAKS_FILSTØRRELSE_BYTES,
    MAKS_TOTAL_FILSTØRRELSE_BYTES,
    maksFilstørrelseTekst,
    maksTotalStørrelseTekst,
    tekstNårGrensenErNådd,
} from './vedleggGrenser';

interface FileUploaderProps {
    name: 'vedlegg'; // TODO: Kan dele opp i flere vedleggskategorier, feks "vedleggBarn" | "vedleggKVP"
    control: Control<Søknad>;
    label: string;
    uuid: string;
}

/**
 * Opplasting av vedlegg for ett barn, bygget på Aksel sin `FileUpload`.
 *
 * Komponenten eier ikke grensene selv — de ligger i `vedleggGrenser` og speiler backend, se kommentaren der.
 * `maxSizeInBytes` og `accept` håndheves av Aksel og gir avviste filer tilbake i `onSelect`, mens antallsgrensen må håndteres her: `fileLimit` deaktiverer kun dropsonen når grensen allerede er nådd, og fanger ikke at det velges flere filer på én gang enn det er plass til.
 *
 * Vedleggsfeltet er felles for hele søknaden, mens hver uploader viser og eier kun delene med sin egen [uuid].
 * Antallsgrensen teller derfor alle vedlegg i søknaden, ikke bare barnets — det er slik backend teller.
 */
export default function FileUploader({ name, control, label, uuid }: FileUploaderProps) {
    const [feil, setFeil] = React.useState<string[]>([]);
    const { append, remove, fields } = useFieldArray({ name, control });

    // Indeksen i det fulle feltarrayet må følge med: `remove` tar den, mens visningen kun er barnets egne vedlegg.
    // Uten dette ville sletting hos barn nummer to fjernet feil fil.
    const vedleggForDetteBarnet = fields
        .map((vedlegg, indeksIFeltarray) => ({ vedlegg, indeksIFeltarray }))
        .filter(({ vedlegg }) => vedlegg.uuid === uuid);

    /**
     * Antalls- og totalgrensen må håndteres her, ikke av Aksel.
     * `maxSizeInBytes` og `accept` gjelder én fil av gangen, mens disse to avhenger av hva som allerede ligger i søknaden — og `fileLimit` deaktiverer bare dropsonen i etterkant, den avviser ikke filer i et utvalg som sprenger grensen.
     * Filene tas i den rekkefølgen brukeren valgte dem, slik at det er de siste som faller utenfor.
     * Begge grensene telles på hele søknaden, ikke på barnet — se `vedleggGrenser`.
     */
    const håndterValgteFiler = (_filer: unknown, { accepted, rejected }: FilesPartitioned) => {
        const ledigePlasser = Math.max(MAKS_ANTALL_VEDLEGG - fields.length, 0);
        const skalLeggesTil: File[] = [];
        let brukteBytes = fields.reduce((sum, vedlegg) => sum + vedlegg.file.size, 0);
        let avvistPgaAntall = 0;
        let avvistPgaTotal = 0;

        accepted.forEach((file) => {
            if (skalLeggesTil.length >= ledigePlasser) {
                avvistPgaAntall++;
            } else if (brukteBytes + file.size > MAKS_TOTAL_FILSTØRRELSE_BYTES) {
                avvistPgaTotal++;
            } else {
                brukteBytes += file.size;
                skalLeggesTil.push(file);
            }
        });

        // Dedupliseres: to filer med samme navn og samme avvisningsgrunn gir samme melding, og å vise
        // den to ganger sier brukeren ingenting nytt. Gjør samtidig meldingen brukbar som React-key.
        setFeil([
            ...new Set([
                ...rejected.map(({ file, reasons }) => feilmeldingForAvvistFil(file.name, reasons)),
                ...(avvistPgaAntall > 0 ? [feilmeldingForAntall(avvistPgaAntall)] : []),
                ...(avvistPgaTotal > 0 ? [feilmeldingForTotalStørrelse(avvistPgaTotal)] : []),
            ]),
        ]);

        skalLeggesTil.forEach((file) => append({ file, uuid }));
    };

    return (
        <VStack gap="space-16">
            {vedleggForDetteBarnet.length > 0 && (
                <VStack gap="space-8" as="ul">
                    {vedleggForDetteBarnet.map(({ vedlegg, indeksIFeltarray }) => (
                        <FileUpload.Item
                            as="li"
                            key={vedlegg.id}
                            file={vedlegg.file}
                            button={{ action: 'delete', onClick: () => remove(indeksIFeltarray) }}
                        />
                    ))}
                </VStack>
            )}
            <FileUpload.Dropzone
                label={label}
                description={`Vedlegget kan være PDF, JPG eller PNG, og maks ${maksFilstørrelseTekst}. Til sammen kan vedleggene være maks ${maksTotalStørrelseTekst}.`}
                accept={GODKJENTE_FILTYPER}
                maxSizeInBytes={MAKS_FILSTØRRELSE_BYTES}
                fileLimit={{ max: MAKS_ANTALL_VEDLEGG, current: fields.length }}
                translations={{ disabledFilelimit: tekstNårGrensenErNådd }}
                onSelect={håndterValgteFiler}
            />
            {/*
             * Meldingene ligger her og ikke i dropsonens `error`-prop med vilje.
             * `fileLimit` deaktiverer dropsonen når grensen er nådd, og Aksel skjuler `error` for deaktiverte felter (`showErrorMsg = !disabled && ...` i `useFormField`).
             * Antallsmeldingen ville dermed forsvunnet i akkurat det tilfellet den forklarer.
             */}
            <div aria-live="polite">
                {feil.map((melding) => (
                    <ErrorMessage key={melding} showIcon>
                        {melding}
                    </ErrorMessage>
                ))}
            </div>
        </VStack>
    );
}
