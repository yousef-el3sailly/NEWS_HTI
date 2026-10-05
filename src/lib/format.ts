export function formatArabicDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/** Friendly Arabic message for any backend / network failure. */
export function friendlyError(error: unknown, fallback = "حصلت مشكلة، حاول تاني بعد شوية.") {
  if (typeof error === "object" && error !== null && "message" in error) {
    const msg = String((error as { message: string }).message);
    if (/invalid login credentials/i.test(msg)) return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
    if (/already registered|already exists/i.test(msg)) return "هذا البريد الإلكتروني مسجّل بالفعل.";
    if (/email not confirmed/i.test(msg)) return "من فضلك أكّد بريدك الإلكتروني أولاً.";
    if (/password/i.test(msg) && /6|short|weak/i.test(msg))
      return "كلمة المرور قصيرة جداً (6 أحرف على الأقل).";
    if (/rate limit|too many/i.test(msg)) return "محاولات كتيرة، استنى شوية وحاول تاني.";
    if (/network|fetch/i.test(msg)) return "تعذّر الاتصال بالخادم، تأكد من الإنترنت.";
    if (/row-level security|permission|denied/i.test(msg))
      return "ليس لديك صلاحية لتنفيذ هذا الإجراء.";
  }
  return fallback;
}

/**
 * Display-only formatting for specialization labels.
 * Isolates the label in an RTL run (RLI…PDI) so a trailing Latin abbreviation
 * such as "(BIS)" always renders after the Arabic name, never before it.
 * The underlying stored value is never changed.
 */
export function formatSpecialization(value?: string | null) {
  if (!value) return "";
  return `\u2067${value}\u2069`;
}
