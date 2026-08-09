export interface PasswordValidationResult {
  isValid: boolean;
  hasUppercase: boolean;
  hasDigit: boolean;
  hasSpecialChar: boolean;
  hasMinLength: boolean;
  errorMessage: string | null;
}

export const validatePassword = (password: string): PasswordValidationResult => {
  const hasUppercase = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
  const hasMinLength = password.length >= 8;

  const missing: string[] = [];
  if (!hasMinLength) missing.push("8+ characters");
  if (!hasUppercase) missing.push("an uppercase letter");
  if (!hasDigit) missing.push("a digit");
  if (!hasSpecialChar) missing.push("a special character");

  const isValid = hasUppercase && hasDigit && hasSpecialChar && hasMinLength;

  let errorMessage: string | null = null;
  if (!isValid && password.length > 0) {
    if (missing.length === 4) {
      errorMessage = "Password must contain at least 8 characters, an uppercase letter, a digit, and a special character.";
    } else {
      errorMessage = `Password must contain ${missing.join(", ")}.`;
    }
  }

  return {
    isValid,
    hasUppercase,
    hasDigit,
    hasSpecialChar,
    hasMinLength,
    errorMessage,
  };
};
