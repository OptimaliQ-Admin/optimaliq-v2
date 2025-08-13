export function getSectorETFSymbol(industry: string): string | null {
  const key = (industry || '').toLowerCase();
  const map: Record<string, string> = {
    technology: 'XLK',
    tech: 'XLK',
    software: 'XLK',
    saas: 'XLK',
    healthcare: 'XLV',
    health: 'XLV',
    finance: 'XLF',
    financials: 'XLF',
    retail: 'XRT',
    consumer: 'XLY',
    energy: 'XLE',
    industrial: 'XLI',
    telecommunications: 'XLC',
    communication: 'XLC',
  };
  return map[key] || 'XLK';
}


