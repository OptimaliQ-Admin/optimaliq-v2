// LinkedIn: https://(www.)linkedin.com/in/{username}
export function isValidLinkedInUrl(url: string): boolean {
  const regex = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-_%]+\/?$/;
  return regex.test(url.trim());
}

// Strong email regex
export function isValidEmail(email: string): boolean {
  // RFC 5322 Official Standard (simplified)
  const regex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return regex.test(email.trim());
}

// Disposable email domains (partial, can be expanded)
const disposableDomains = [
  'mailinator.com', 'guerrillamail.com', '10minutemail.com', 'tempmail.com',
  'yopmail.com', 'trashmail.com', 'fakeinbox.com', 'getnada.com', 'dispostable.com',
  'maildrop.cc', 'mintemail.com', 'throwawaymail.com', 'sharklasers.com', 'spamgourmet.com',
  'mailnesia.com', 'mailcatch.com', 'spambog.com', 'spambox.us', 'mytemp.email',
  'moakt.com', 'emailondeck.com', 'mail-temp.com', 'temp-mail.org', 'temp-mail.ru',
  'temp-mail.io', 'temp-mail.com', 'tempmail.net', 'tempmail.org', 'tempmail.ru',
  'tempmailo.com', 'mail7.io', 'disposablemail.com', 'disposablemail.net', 'disposablemail.org',
  'disposablemail.com', 'disposablemail.net', 'disposablemail.org', 'mailpoof.com',
];

export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return !!domain && disposableDomains.some(d => domain === d || domain.endsWith('.' + d));
} 