import { useState } from 'react';
import { FileObject, FileRejected, FileRejectionReason, Heading, VStack, UNSAFE_FileUpload } from '@navikt/ds-react';
import { useFieldArray } from 'react-hook-form';
import Søknad from '@/types/Søknad';

interface NyFileUploader {
    uuid: string;
}

export const NyFileUploader = ({ uuid }: NyFileUploader) => {
    const [files, setFiles] = useState<FileObject[]>([]);
    const vedlegg = useFieldArray<Søknad>({ name: 'vedlegg' });

    function removeFile(fileToRemove: FileObject, index: number) {
        vedlegg.remove(index);
        setFiles(files.filter((file) => file !== fileToRemove));
    }

    const acceptedFiles = files.filter((file) => !file.error);
    const rejectedFiles = files.filter((f): f is FileRejected => f.error);

    return (
        <VStack gap="6">
            <UNSAFE_FileUpload.Dropzone
                label="Last opp filer til søknaden"
                description={`Du kan laste opp Word- og PDF-filer. Maks 3 filer. Maks størrelse ${MAX_SIZE_MB} MB.`}
                accept="image/jpg,image/jpeg,image/png,application/pdf"
                maxSizeInBytes={MAX_SIZE}
                fileLimit={{ max: MAX_FILES, current: acceptedFiles.length }}
                onSelect={(newFiles) => setFiles([...files, ...newFiles])}
            />

            {acceptedFiles.length > 0 && (
                <VStack gap="2">
                    <Heading level="3" size="xsmall">
                        {`Vedlegg (${acceptedFiles.length})`}
                    </Heading>
                    <VStack as="ul" gap="3">
                        {acceptedFiles.map((file, index) => {
                            vedlegg.append({ file: file.file, uuid: uuid });
                            return (
                                <UNSAFE_FileUpload.Item
                                    as="li"
                                    key={index}
                                    file={file.file}
                                    button={{
                                        action: 'delete',
                                        onClick: () => removeFile(file, index),
                                    }}
                                />
                            );
                        })}
                    </VStack>
                </VStack>
            )}
            {rejectedFiles.length > 0 && (
                <VStack gap="2">
                    <Heading level="3" size="xsmall">
                        Vedlegg med feil
                    </Heading>
                    <VStack as="ul" gap="3">
                        {rejectedFiles.map((rejected, index) => (
                            <UNSAFE_FileUpload.Item
                                as="li"
                                key={index}
                                file={rejected.file}
                                error={rejected.reasons[0] === 'fileType' ? errors.fileType : errors.fileSize}
                                button={{
                                    action: 'delete',
                                    onClick: () => removeFile(rejected, index),
                                }}
                            />
                        ))}
                    </VStack>
                </VStack>
            )}
        </VStack>
    );
};

const MAX_FILES = 10;
const MAX_SIZE_MB = 1;
const MAX_SIZE = MAX_SIZE_MB * 1024 * 1024;

const errors: Record<FileRejectionReason, string> = {
    fileType: 'Filformatet støttes ikke',
    fileSize: `Filen er større enn ${MAX_SIZE_MB} MB`,
};
