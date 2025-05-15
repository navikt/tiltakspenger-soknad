import { Button, Heading, Modal } from '@navikt/ds-react';
import React, { useState } from 'react';
import { TrashIcon } from '@navikt/aksel-icons';
import styles from './Barnetillegg.module.css';
import stepStyles from './../../components/step/Step.module.css';
import { Barn } from '@/types/Barn';

interface SlettModalProps {
    barn: Barn;
    onDelete: () => void;
}

export const SlettBarnModal: React.FC<SlettModalProps> = ({ barn, onDelete }) => {
    const [open, setOpen] = useState(false);

    const åpneModal = () => setOpen(true);
    const lukkModal = () => setOpen(false);

    return (
        <>
            <Button type="button" icon={<TrashIcon aria-hidden />} variant="tertiary" onClick={åpneModal}>
                Slett
            </Button>

            <Modal
                open={open}
                aria-label="Slett barn fra søknaden"
                onClose={lukkModal}
                aria-labelledby="modal-heading"
                className={styles.modalSlettBarn}
            >
                <Modal.Content role="dialog">
                    <Heading spacing level="1" size="large" id="modal-heading">
                        Slett barn fra søknaden
                    </Heading>
                    <p>{`Er du sikker på at du vil slette barnet ${barn.fornavn} ${barn.etternavn} fra søknaden?`}</p>
                    <div className={stepStyles.step__buttonsection}>
                        <Button type="button" onClick={lukkModal} variant="secondary">
                            Avbryt
                        </Button>
                        <Button
                            type="button"
                            onClick={() => {
                                onDelete();
                                lukkModal();
                            }}
                            variant="danger"
                        >
                            Slett
                        </Button>
                    </div>
                </Modal.Content>
            </Modal>
        </>
    );
};
