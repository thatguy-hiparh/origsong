/**
 * Utility functions for ISRC (International Standard Recording Code) formatting
 */

/**
 * Formats ISRC code to remove dashes (CCXXXYYNNNNN format)
 * @param {string} isrc - The ISRC code to format
 * @returns {string} - The formatted ISRC code without dashes
 */
export const formatISRCWithoutDashes = (isrc) => {
  if (!isrc || typeof isrc !== 'string') {
    return '';
  }
  
  // Remove all dashes and convert to uppercase
  return isrc.replace(/-/g, '').toUpperCase().trim();
};

/**
 * Formats ISRC code with dashes (CC-XXX-YY-NNNNN format)
 * @param {string} isrc - The ISRC code to format
 * @returns {string} - The formatted ISRC code with dashes
 */
export const formatISRCWithDashes = (isrc) => {
  if (!isrc || typeof isrc !== 'string') {
    return '';
  }
  
  // Remove existing dashes and convert to uppercase
  const cleanISRC = isrc.replace(/-/g, '').toUpperCase().trim();
  
  // Check if it's a valid ISRC length (12 characters)
  if (cleanISRC.length !== 12) {
    return isrc; // Return original if invalid length
  }
  
  // Format as CC-XXX-YY-NNNNN
  return `${cleanISRC.slice(0, 2)}-${cleanISRC.slice(2, 5)}-${cleanISRC.slice(5, 7)}-${cleanISRC.slice(7, 12)}`;
};

/**
 * Validates ISRC format (accepts both dashed and non-dashed formats)
 * @param {string} isrc - The ISRC code to validate
 * @returns {boolean} - True if valid ISRC format
 */
export const validateISRCFormat = (isrc) => {
  if (!isrc || typeof isrc !== 'string') {
    return false;
  }
  
  // Remove dashes and convert to uppercase
  const cleanISRC = isrc.replace(/-/g, '').toUpperCase().trim();
  
  // ISRC format: 2 letters + 3 alphanumeric + 2 digits + 5 digits
  const isrcPattern = /^[A-Z]{2}[A-Z0-9]{3}\d{2}\d{5}$/;
  return isrcPattern.test(cleanISRC);
};

/**
 * Normalizes ISRC code to standard format (without dashes)
 * @param {string} isrc - The ISRC code to normalize
 * @returns {string} - The normalized ISRC code
 */
export const normalizeISRC = (isrc) => {
  if (!isrc || typeof isrc !== 'string') {
    return '';
  }
  
  const cleanISRC = formatISRCWithoutDashes(isrc);
  return validateISRCFormat(cleanISRC) ? cleanISRC : '';
};

/**
 * Checks if ISRC code is in dashed format
 * @param {string} isrc - The ISRC code to check
 * @returns {boolean} - True if in dashed format
 */
export const isISRCDashed = (isrc) => {
  if (!isrc || typeof isrc !== 'string') {
    return false;
  }
  
  return isrc.includes('-');
};