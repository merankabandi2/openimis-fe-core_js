// Tells an expired session apart from a permission refusal in GraphQL errors.
// Pure module (no imports) so it runs under `node --test`.

export const normalizeErrorMessage = (message) =>
  String(message || "")
    .toLowerCase()
    .replace(/['"]/g, "")
    .trim();

// `csrftoken` is the KeyError raised once the Django session holding the CSRF
// token has expired. "Unauthorized" and "User not authorized for this
// operation" are permission refusals of a valid session and do not match.
export const isSessionError = (gqlErrors = []) =>
  gqlErrors.some((error) => normalizeErrorMessage(error?.message) === "csrftoken");
