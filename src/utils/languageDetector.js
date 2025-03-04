import settings from "../assets/settings.json" with { type: 'json' };


export const detectLanguage = () => {
	const env = process.env;
	
	const locale = settings.lang || env.LANG || env.LANGUAGE || env.LC_ALL  || env.LC_MESSAGES;
	if (locale?.startsWith('es')) return 'es';
	return 'en';
}