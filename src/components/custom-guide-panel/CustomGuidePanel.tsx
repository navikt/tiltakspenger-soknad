import React from 'react';
import { GuidePanel, GuidePanelProps } from '@navikt/ds-react';

export default function CustomGuidePanel(props: GuidePanelProps) {
    return <GuidePanel poster {...props} />;
}
