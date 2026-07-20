export class Validators {
  /**
   * Validate email address
   */
  static validateEmail(value: string | null | undefined): string | null {
    if (value === null || value === undefined || value.trim() === '') {
      return 'Email tidak boleh kosong';
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value.trim())) {
      return 'Format email tidak valid';
    }
    return null;
  }

  /**
   * Validate access code (alphanumeric, 4-20 chars)
   */
  static validateCode(value: string | null | undefined): string | null {
    if (value === null || value === undefined || value.trim() === '') {
      return 'Kode tidak boleh kosong';
    }
    const trimmed = value.trim();
    if (trimmed.length < 4) {
      return 'Kode minimal 4 karakter';
    }
    if (trimmed.length > 20) {
      return 'Kode maksimal 20 karakter';
    }
    return null;
  }

  /**
   * Check if email is valid (returns boolean)
   */
  static isEmailValid(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  }
}

/**
 * Standalone helper — validate email format.
 * Returns true if the email is non-empty and matches RFC-5322 pattern.
 */
export function isValidEmail(email: string): boolean {
  if (!email || email.trim() === '') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

