/**
 * Map of English to Nepali numerals
 */
const nepaliDigits: Record<string, string> = {
  "0": "०",
  "1": "१",
  "2": "२",
  "3": "३",
  "4": "४",
  "5": "५",
  "6": "६",
  "7": "७",
  "8": "८",
  "9": "९",
};

/**
 * Convert a number or string containing digits to its Nepali equivalent
 * @param value Number or string to convert
 * @returns String with Nepali digits
 */
export function toNepaliDigits(value: number | string): string {
  const stringValue = value.toString();
  return stringValue.replace(/[0-9]/g, (match) => nepaliDigits[match] || match);
}

/**
 * Convert a number or string to localized digits based on the specified locale
 * @param value Number or string to convert
 * @param locale Current locale ('ne' for Nepali, any other value for English)
 * @returns String with localized digits
 */
export function localizeNumber(value: number | string, locale: string): string {
  return locale === "ne" ? toNepaliDigits(value) : value.toString();
}
