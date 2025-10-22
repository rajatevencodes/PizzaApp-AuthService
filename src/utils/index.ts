export const isValidEmail = (email: string): boolean => {
  // This regex is a common, simple check.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): string => {
  
  // Check for common weak passwords FIRST
  const weakPasswords = ["password", "123456", "qwerty", "admin", "letmein", "welcome", "monkey"];
  const lowerPassword = password.toLowerCase();
  
  // Check for exact matches and common variations
  if (weakPasswords.some(weak => lowerPassword.includes(weak) || weak.includes(lowerPassword))) {
    return "Password is too common, please choose a stronger password";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }

  // Check for number
  if (!/\d/.test(password)) {
    return "Password must contain at least one number";
  }

  // Check for special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "Password must contain at least one special character";
  }

  return "";
};

export const isStringEmpty = (value:unknown) => {
  return !value || (typeof value === "string" && value.trim() === "");
};

export const validateRequiredFields = (body: unknown, requiredFields: string[]) => {
  for (const field of requiredFields) {
    const value = (body as Record<string, unknown>)[field];

    if (
      (typeof value === "string" && isStringEmpty(value)) ||
      value === null ||
      value === undefined
    ) {
      return `${field} is required`;
    }
  }
  return null;
};
