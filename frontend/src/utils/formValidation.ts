/**
 * Form Validation Utilities
 *
 * Centralizes form validation logic to eliminate duplication across the app.
 * Provides consistent validation rules and error messages.
 */

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

/**
 * Event form data interface for validation
 */
export interface EventFormData {
  title: string;
  description: string;
  tags: string[];
  date: string;
}

/**
 * Validates event form data
 *
 * Checks:
 * - Title is not empty
 * - Description is not empty
 * - Description length is under 500 characters
 * - At least one tag is selected
 * - Date is not in the past (if provided)
 *
 * @param formData - The form data to validate
 * @param context - Optional context for error messages ('submit' or 'preview')
 * @returns ValidationResult with isValid boolean and error message if invalid
 *
 * @example
 * const validation = validateEventForm(formData, 'submit');
 * if (!validation.isValid) {
 *   setError(validation.error);
 *   return;
 * }
 */
export function validateEventForm(
  formData: EventFormData,
  context: 'submit' | 'preview' = 'submit'
): ValidationResult {
  // Title validation
  if (!formData.title.trim()) {
    const message =
      context === 'preview'
        ? 'Please enter an event title before previewing'
        : 'Please enter an event title';
    return { isValid: false, error: message };
  }

  // Description validation
  if (!formData.description.trim()) {
    const message =
      context === 'preview'
        ? 'Please enter a description before previewing'
        : 'Please enter a description';
    return { isValid: false, error: message };
  }

  // Description length validation
  if (formData.description.length > 500) {
    return {
      isValid: false,
      error: 'Description must be under 500 characters',
    };
  }

  // Tags validation
  if (formData.tags.length === 0) {
    const message =
      context === 'preview'
        ? 'Please select at least one tag before previewing'
        : 'Please select at least one tag';
    return { isValid: false, error: message };
  }

  // Date validation (if provided)
  if (formData.date) {
    const selectedDate = new Date(formData.date);
    const now = new Date();
    if (selectedDate < now) {
      return {
        isValid: false,
        error: 'Event date cannot be in the past',
      };
    }
  }

  // All validations passed
  return { isValid: true, error: null };
}
