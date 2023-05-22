import { Error, Success } from '@navikt/ds-icons';
import { BodyShort, Label } from '@navikt/ds-react';
import React, { useMemo } from 'react';

import ScanningIcon from './ScanningIcon';

export interface ScanningGuideProps {
    className?: string;
    locale?: string;
}

const tekster = {
    title: 'Slik tar du et godt bilde av dokumentet',
    alert: {
        takePictureTitle: 'Slik tar du et godt bilde',
        bulletPointTakePicture1:
            'Hold mobilen eller kameraet direkte over dokumentet.',
        bulletPointTakePicture2:
            'Dokumentet skal fylle hele bildet. Bildet skal ikke inneholde annen dokumentasjon eller gjenstander.',
        bulletPointTakePicture3:
            'Bildet må inneholde all tekst i dokumentet. Hvis dokumentet er på mer enn èn side, bør du laste opp flere bilder.',
        checkPictureTitle:
            'Etter at du har tatt bildet, sjekk følgende før du laster opp:',
        bulletPointCheckPicture1: 'Dokumentet har riktig retning.',
        bulletPointCheckPicture2: 'Teksten til dokumentet er godt leselig.',
        bulletPointCheckPicture3: 'Bildet er godt opplyst, uten skygger.',
        examplesPicturesTitle:
            'Bra og dårlige eksempler på bilder av dokumenter',
        exampleLabelGood: 'Bra',
        exampleLabelBad: 'Dårlig',
        exampleGood: 'Dokumentet fyller hele bildet',
        exampleKeystone: 'Bildet er ikke tatt ovenfra',
        exampleHorizontal: 'Bildet har ikke riktig retning',
        exampleShaddow: 'Bildet har skygge på dokumentet',
    },
};

export const ScanningGuide = ({
    className,
    locale = 'nb',
}: ScanningGuideProps) => {
    return (
        <div style={{ display: 'flex' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        paddingTop: '0.5rem',
                    }}
                >
                    <ScanningIcon
                        status={'good'}
                        title={tekster?.alert?.exampleLabelGood}
                    />
                    <div style={{ padding: '0.5rem' }}>
                        <span>
                            <Success color={'var(--a-green-600)'} />
                            <Label as="span">
                                {tekster?.alert?.exampleLabelGood}
                            </Label>
                        </span>
                        <BodyShort>{tekster?.alert?.exampleGood}</BodyShort>
                    </div>
                </div>
                <div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            paddingTop: '0.5rem',
                        }}
                    >
                        <ScanningIcon
                            status={'keystone'}
                            title={tekster?.alert?.exampleLabelBad}
                        />
                        <div style={{ padding: '0.5rem' }}>
                            <span>
                                <Error color={'var(--a-nav-red)'} />
                                <Label as="span">
                                    {tekster?.alert?.exampleLabelBad}
                                </Label>
                            </span>
                            <BodyShort>
                                {tekster?.alert?.exampleKeystone}
                            </BodyShort>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            paddingTop: '0.5rem',
                        }}
                    >
                        <ScanningIcon
                            status={'horizontal'}
                            title={tekster?.alert?.exampleLabelBad}
                        />
                        <div style={{ padding: '0.5rem' }}>
                            <span className={'scanning-example-status'}>
                                <Error color={'var(--a-nav-red)'} />
                                <Label as="span">
                                    {tekster?.alert?.exampleLabelBad}
                                </Label>
                            </span>
                            <BodyShort>
                                {tekster?.alert?.exampleHorizontal}
                            </BodyShort>
                        </div>
                    </div>
                </div>
                <div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            paddingTop: '0.5rem',
                            paddingBottom: '0.5rem',
                        }}
                    >
                        <ScanningIcon
                            status={'shadow'}
                            title={tekster?.alert?.exampleLabelBad}
                        />
                        <div style={{ padding: '0.5rem' }}>
                            <span className={'scanning-example-status'}>
                                <Error color={'var(--a-nav-red)'} />
                                <Label as="span">
                                    {tekster?.alert?.exampleLabelBad}
                                </Label>
                            </span>
                            <BodyShort>
                                {tekster?.alert?.exampleShaddow}
                            </BodyShort>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
