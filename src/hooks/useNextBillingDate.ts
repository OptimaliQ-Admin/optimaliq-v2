import { useState, useEffect } from 'react';

interface NextBillingDateData {
  nextBillingDate: string;
  formattedDate: string;
}

interface UseNextBillingDateReturn {
  nextBillingDate: NextBillingDateData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useNextBillingDate(customerId: string | null): UseNextBillingDateReturn {
  const [nextBillingDate, setNextBillingDate] = useState<NextBillingDateData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNextBillingDate = async () => {
    if (!customerId) {
      setError("No customer ID available");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/premium/account/next-billing-date', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId }),
      });

      if (response.ok) {
        const data = await response.json();
        setNextBillingDate(data);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.error || 'Failed to fetch next billing date');
      }
    } catch (err) {
      setError('Network error while fetching next billing date');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchNextBillingDate();
    }
  }, [customerId]);

  const refetch = () => {
    fetchNextBillingDate();
  };

  return {
    nextBillingDate,
    loading,
    error,
    refetch
  };
} 