import { evaluateFlags, flagsClient, getDefinitions, randomSessionId } from '@unleash/nextjs';

export async function featureIsEnabled(featureName: string) {
    const sessionId = randomSessionId();
    const definitions = await getDefinitions();
    const { toggles } = evaluateFlags(definitions!!, { sessionId });
    const flags = flagsClient(toggles);
    return flags.isEnabled(featureName);
}
