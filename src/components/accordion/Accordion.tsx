import React from 'react';
import { Accordion as DsAccordion } from '@navikt/ds-react';

interface AccordionProps {
    header: string;
    children: React.ReactNode;
}

export default function Accordion({ header, children }: AccordionProps) {
    return (
        <DsAccordion>
            <DsAccordion.Item>
                <DsAccordion.Header>{header}</DsAccordion.Header>
                <DsAccordion.Content>{children}</DsAccordion.Content>
            </DsAccordion.Item>
        </DsAccordion>
    );
}
