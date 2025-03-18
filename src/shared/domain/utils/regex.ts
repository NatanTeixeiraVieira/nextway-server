export const Regex = {
	NO_SPACES: /^\S*$/,
	ONLY_DIGITS: /^\d+$/,
	TIME_HHMM_FORMAT: /^([01]\d|2[0-3]):([0-5]\d)$/,
} as const;
