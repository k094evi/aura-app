export const PASSWORD_POLICY_MESSAGE =
  'At least 8 characters, including a lowercase letter, an uppercase letter, a number, and a symbol.';

export function getPasswordPolicyError(password: string): string | null {
  const meetsPolicy =
    Array.from(password).length >= 8 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9\s]/.test(password);

  return meetsPolicy
    ? null
    : `Password must meet all requirements: ${PASSWORD_POLICY_MESSAGE.toLowerCase()}`;
}
