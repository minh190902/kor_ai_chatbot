import i18n from '../i18n';

export function getLanguageName() {
  const lang = i18n.language || 'vi';
  try {
    const displayNames = new Intl.DisplayNames(['en'], { type: 'language' });
    return displayNames.of(lang) || 'Vietnamese';
  } catch {
    return 'Vietnamese';
  }
}