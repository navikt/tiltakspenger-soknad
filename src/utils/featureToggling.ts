import { evaluateFlags, flagsClient, getDefinitions, randomSessionId } from '@unleash/nextjs';

function utledFødselsdatoFraToken(bearerToken: string) {
    const jwt = bearerToken!!.replace('Bearer ', '').split('.')[1];
    const payload = JSON.parse(Buffer.from(jwt, 'base64').toString());
    return payload.pid.substring(0, 4);
}

export async function featureIsEnabled(featureName: string, userId = randomSessionId()) {
    const definitions = await getDefinitions();
    const { toggles } = evaluateFlags(definitions!!, { userId });
    const flags = flagsClient(toggles);
    return flags.isEnabled(featureName);
}

export async function brukerSkalRedirectesTilGammelSøknad(bearerToken: string) {
    const fødselsdato = utledFødselsdatoFraToken(bearerToken);
    return featureIsEnabled('REDIRECT_TIL_GAMMEL_SOKNAD', fødselsdato);
}
