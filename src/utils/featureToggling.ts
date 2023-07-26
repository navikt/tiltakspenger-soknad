import { evaluateFlags, flagsClient, getDefinitions, randomSessionId } from '@unleash/nextjs';
import logger from '@/utils/serverLogger';
import { ClientFeaturesResponse } from 'unleash-client';

let definitions: ClientFeaturesResponse | null = null;

async function setupUnleash() {
    logger.info('Starter oppsett av unleash');
    definitions = await getDefinitions();
    logger.info('Oppsett av unleash OK');
}

function getFlags() {
    const sessionId = randomSessionId();
    const { toggles } = evaluateFlags(definitions!!, { sessionId });
    const flags = flagsClient(toggles);
    return flags;
}

export async function featureIsEnabled(featureName: string) {
    if (definitions == null) {
        try {
            await setupUnleash();
        } catch (e) {
            throw e;
        }
    }
    const flags = getFlags();
    return flags.isEnabled(featureName);
}
