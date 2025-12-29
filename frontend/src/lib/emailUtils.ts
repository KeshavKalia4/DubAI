/**
 * Email Utilities
 *
 * Helper functions for validating and extracting information from email addresses.
 * Primarily used for .edu email validation and organization detection.
 */

/**
 * Validate that an email address is a valid .edu email
 *
 * @param email - The email address to validate
 * @returns True if the email is a valid .edu address
 *
 * @example
 * isValidEduEmail('student@uw.edu') // true
 * isValidEduEmail('student@gmail.com') // false
 * isValidEduEmail('invalid-email') // false
 */
export function isValidEduEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.edu$/i;
  return emailRegex.test(email);
}

/**
 * Extract the domain from an email address
 *
 * @param email - The email address to parse
 * @returns The domain portion (e.g., "uw.edu")
 *
 * @example
 * getEmailDomain('student@uw.edu') // "uw.edu"
 */
export function getEmailDomain(email: string): string {
  const parts = email.split('@');
  return parts[1] || '';
}

/**
 * Extract organization name from email domain
 * Recognizes common university domains and provides fallback.
 *
 * @param email - The email address to parse
 * @returns Organization name (e.g., "University of Washington")
 *
 * @example
 * getOrgFromEmail('student@uw.edu') // "University of Washington"
 * getOrgFromEmail('student@wsu.edu') // "Washington State University"
 * getOrgFromEmail('student@mit.edu') // "mit"
 */
export function getOrgFromEmail(email: string): string {
  const domain = getEmailDomain(email);

  // Known university mappings
  const orgMap: Record<string, string> = {
    'uw.edu': 'University of Washington',
    'washington.edu': 'University of Washington',
    'wsu.edu': 'Washington State University',
  };

  // Check for known domains
  for (const [key, value] of Object.entries(orgMap)) {
    if (domain.includes(key)) {
      return value;
    }
  }

  // Fallback: remove .edu and return domain name
  return domain.replace('.edu', '') || 'Unknown';
}
