import {GuidePanel} from "@navikt/ds-react";
import React, {useContext} from "react";
import {UtfyllingContext} from "@/pages/utfylling/[[...step]]";

export default function IkkeMyndig(){
    const {  personalia} = useContext(UtfyllingContext);

    return (
        <GuidePanel poster>
            <p>Hei, {`${personalia?.fornavn} ${personalia?.etternavn}`}</p>
            <p>For å ha rett til tiltakspenger må du være fylt 18 år. Du må også være fylt 18 år for å levere digital søknad om tiltakspenger.</p>
            <p>
                Om du ønsker å søke tiltakspenger før du fylt 18 år, må du få underskrift av en foresatt eller verge og sende søknad med vanlig post.
                Du finner papirsøknaden som du kan skrive ut ved å trykke på knappen under merket "Send søknad med post".
            </p>
        </GuidePanel>
    )
}
