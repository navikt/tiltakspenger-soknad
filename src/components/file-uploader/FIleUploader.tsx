import React, { DragEventHandler } from 'react';
import styles from './FileUploader.module.css';
import { BodyShort, Detail, Panel } from '@navikt/ds-react';
import { UploadIcon } from '@navikt/aksel-icons';
import classNames from 'classnames';
import { Control, useFieldArray } from 'react-hook-form';
import { Delete, FileSuccess } from '@navikt/ds-icons';

interface FileUploaderProps {
    name: string;
    control: Control;
    kategori: string;
}

export default function FileUploader({ name, control, kategori }: FileUploaderProps) {
    const [dragOver, setDragOver] = React.useState<boolean>(false);
    const fileUploadInputElement = React.useRef<HTMLInputElement>(null);
    const inputId = 'test';
    const { append, remove, fields } = useFieldArray({
        name,
        control,
    });

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
    };

    const cls = classNames(styles.fileInput, {
        [styles.dragOver]: dragOver,
    });

    const fileSizeString = (size: number) => {
        const kb = size / 1024;
        return kb > 1000 ? `${(kb / 1024).toFixed(1)} mB` : `${Math.floor(kb)} kB`;
    };

    return (
        <div className={cls}>
            {fields?.map((attachment, index) => {
                return (
                    <Panel className={styles.fileCard} key={attachment.id}>
                        <div className={styles.fileCardLeftContent}>
                            <div className={styles.fileSuccess}>
                                <FileSuccess color={'var(--a-icon-success)'} />
                            </div>
                            <div className={styles.fileInputText}>
                                <span>{(attachment as any).name}</span>
                                <Detail>{fileSizeString((attachment as any).size)}</Detail>
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
                            <Delete title={'Slett'} />
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
                            append(file);
                        }}
                        className={styles.visuallyHidden}
                        tabIndex={-1}
                        ref={fileUploadInputElement}
                        accept="image/*,.pdf"
                    />
                    <BodyShort>{'Dra og slipp'}</BodyShort>
                    <BodyShort>{'eller'}</BodyShort>
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
                            Velg dine filer for {kategori}
                        </span>
                    </label>
                </>
            </div>
        </div>
    );
}
