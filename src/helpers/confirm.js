// Intent of the confirm dialog the next answer belongs to. Pure module (no
// imports) so it runs under `node --test`.

// Each opened confirm replaces the intent, with null when it carries none;
// clearing the confirm (answer given) keeps the intent of the answered one.
export const nextConfirmIntent = (previousIntent, confirm) =>
  confirm ? confirm.intent ?? null : previousIntent;

// OK on a confirm opened with the "csrf_logout" intent logs the user out.
export const isLogoutConfirmed = (confirmed, intent) => confirmed === true && intent === "csrf_logout";
