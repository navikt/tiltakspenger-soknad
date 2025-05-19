import React, { DragEventHandler, useEffect, useRef } from 'react';
import styles from './FileUploader.module.css';
import { Alert, BodyShort, Detail, Link, Panel } from '@navikt/ds-react';
import { UploadIcon } from '@navikt/aksel-icons';
import classNames from 'classnames';
import { Control, useFieldArray } from 'react-hook-form';
import { Delete, Download, FileSuccess } from '@navikt/ds-icons';
import Søknad from '@/types/Søknad';

interface FileUploaderProps {
    name: 'vedlegg'; // TODO: Kan dele opp i flere vedleggskategorier, feks "vedleggBarn" | "vedkeggKVP"
    control: Control<Søknad>;
    knappTekst: string;
    uuid: string;
}

export default function FileUploader({ name, control, knappTekst, uuid }: FileUploaderProps) {
    const [error, setError] = React.useState('');
    const [dragOver, setDragOver] = React.useState<boolean>(false);
    const fileUploadInputElement = React.useRef<HTMLInputElement>(null);
    const objectUrls = useRef<Array<string>>([]);
    useEffect(() => {
        return () => {
            objectUrls.current.map((url) => window.URL.revokeObjectURL(url));
        };
    }, []);
    const inputId = 'test';
    const { append, remove, fields } = useFieldArray({
        name,
        control,
    });
    const MAKS_TOTAL_FILSTØRRELSE = 20000000; //bytes
    const MAKS_DIMENSJON = 3000; //pixels

    const handleDragLeave: DragEventHandler<HTMLDivElement> = (e) => {
        setDragOver(false);
        return e;
    };

    const handleDragEnter: DragEventHandler<HTMLDivElement> = (e) => {
        setDragOver(true);
        return e;
    };

    const handleDragOver: DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
    };

    const handleDrop: DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file && validerStørrelse(file)) {
                setError('');
                append({
                    file,
                    uuid,
                });
            } else {
                setError(`Filen er for stor`);
            }
        }
    };

    const cls = classNames(styles.fileInput, {
        [styles.dragOver]: dragOver,
    });

    const validerStørrelse = (file: File): Boolean => {
        const samletStørrelse = fields.reduce((acc, fil) => acc + fil.file.size, 0);
        return samletStørrelse + file.size < MAKS_TOTAL_FILSTØRRELSE;
    };

    const validerOppløsningVedCallback = (bildefil: Blob, url: string, index: number) => {
        const fileReader = new FileReader();
        fileReader.onload = () => {
            const img = new Image();
            img.onload = () => {
                if (img.naturalWidth > MAKS_DIMENSJON || img.naturalHeight > MAKS_DIMENSJON) {
                    setError('Bildet er for stort');
                    window.URL.revokeObjectURL(url);
                    remove(index);
                }
            };
            img.src = fileReader.result as string;
        };
        fileReader.readAsDataURL(bildefil);
    };

    const fileSizeString = (size: number) => {
        const kb = size / 1024;
        return kb > 1000 ? `${(kb / 1024).toFixed(1)} mB` : `${Math.floor(kb)} kB`;
    };

    return (
        <div className={cls}>
            {fields
                ?.filter((attachment) => attachment.uuid === uuid)
                .map((attachment, index) => {
                    const blob = new Blob([attachment.file]);
                    const url = window.URL.createObjectURL(blob);
                    objectUrls.current.push(url);
                    if (!attachment.file.name.endsWith('.pdf')) validerOppløsningVedCallback(blob, url, index);
                    return (
                        <Panel className={styles.fileCard} key={attachment.id}>
                            <div className={styles.fileCardLeftContent}>
                                <div className={styles.fileSuccess}>
                                    <FileSuccess color={'var(--a-icon-success)'} />
                                </div>
                                <div className={styles.fileInputText}>
                                    <Link href={url} download={attachment.file.name}>
                                        {attachment.file.name}
                                        <Download title="Last ned vedlegg" />
                                    </Link>
                                    <Detail>{fileSizeString(attachment.file.size)}</Detail>
                                </div>
                            </div>
                            <button
                                type={'button'}
                                onClick={() => remove(index)}
                                tabIndex={0}
                                onKeyPress={(event) => {
                                    if (event.key === 'Enter') {
                                        remove(index);
                                    }
                                }}
                                className={styles.deleteAttachment}
                            >
                                <Delete aria-hidden={true} />
                                <BodyShort>{'Slett'}</BodyShort>
                            </button>
                        </Panel>
                    );
                })}

            <div
                className={styles.dropZone}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e)}
            >
                <>
                    <input
                        id={inputId}
                        type="file"
                        value={''}
                        onChange={(e) => {
                            const file = e?.target?.files?.[0];
                            if (file && validerStørrelse(file)) {
                                setError('');
                                append({
                                    file,
                                    uuid,
                                });
                            } else {
                                setError(`Filen er for stor`);
                            }
                        }}
                        className={styles.visuallyHidden}
                        tabIndex={-1}
                        ref={fileUploadInputElement}
                        accept="image/jpg,image/jpeg,image/png,application/pdf"
                    />
                    <BodyShort>{'Dra og slipp'}</BodyShort>
                    <BodyShort className={styles.bodyShort}>{'eller'}</BodyShort>
                    <label htmlFor={inputId}>
                        <span
                            className={`${styles?.fileInputButton} navds-button navds-button__inner navds-body-short navds-button--secondary`}
                            role={'button'}
                            aria-controls={inputId}
                            tabIndex={0}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    fileUploadInputElement?.current?.click();
                                }
                            }}
                        >
                            <UploadIcon />
                            {knappTekst}
                        </span>
                    </label>
                    {error != '' && (
                        <Alert size="small" variant="error" className={styles.alert}>
                            {error}
                        </Alert>
                    )}
                </>
            </div>
        </div>
    );
}
