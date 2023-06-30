import {makeGetRequest} from "@/utils/http";

const backendUrl = process.env.TILTAKSPENGER_SOKNAD_API_URL;

const stripPath = (path: string) => path.startsWith('/') ? path.substring(1) : path

export const VIS_NY_TILTAKSPENGER_SØKNAD_FEATURE_TOGGLE = 'ny.tiltakspenger.soknad.feature.toggle';

export const ALL_TOGGLES = [VIS_NY_TILTAKSPENGER_SØKNAD_FEATURE_TOGGLE];

export interface FeatureToggles {
	[VIS_NY_TILTAKSPENGER_SØKNAD_FEATURE_TOGGLE]: boolean;
}

export const appUrl = (path: string): string => {
	const strippedPath = stripPath(path)
	return `${backendUrl}${strippedPath}`
}

export function fetchFeaturesToggles(token: string): Promise<Response> {
	const features = ALL_TOGGLES.map(feature => `feature=${feature}`).join('&');
	const url = appUrl(`/unleash/api/feature?${features}`);
	return makeGetRequest(url, token);
}
