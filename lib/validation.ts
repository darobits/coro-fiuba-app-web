export function isValidEmail(value: string) {
  const email = value.trim();
  if (!email || email.length > 254 || email.includes("..")) return false;
  const at = email.lastIndexOf("@");
  if (at <= 0 || at !== email.indexOf("@")) return false;
  const local = email.slice(0, at), domain = email.slice(at + 1);
  if (local.length > 64 || local.startsWith(".") || local.endsWith(".")) return false;
  if (!/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local)) return false;
  const labels = domain.split(".");
  if (labels.length < 2 || labels.at(-1)!.length < 2) return false;
  return labels.every(label => /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/.test(label));
}
