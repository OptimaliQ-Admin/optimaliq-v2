// Centralized industry normalization to avoid drift across endpoints and agents
export function normalizeIndustry(input: string | null | undefined): string {
  const raw = (input ?? '').toString().trim().toLowerCase();
  if (!raw) return 'technology';
  switch (raw) {
    case 'saas':
      return 'technology';
    case 'tech':
      return 'technology';
    case 'health care':
      return 'healthcare';
    default:
      return raw;
  }
}


