import React from 'react';
import { GuidePanel, GuidePanelProps } from '@navikt/ds-react';
import { DefaultIllustration } from '@navikt/ds-react/cjs/guide-panel/Illustration';

export default function CustomGuidePanel(props: GuidePanelProps) {
    return <GuidePanel illustration={<DefaultIllustration aria-hidden />} {...props} />;
}
