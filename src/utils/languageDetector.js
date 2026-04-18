import settings from "../assets/settings.json" with { type: 'json' };


export const detectLanguage = () => {
	const locale = settings.lang || 'en';
	return locale
}