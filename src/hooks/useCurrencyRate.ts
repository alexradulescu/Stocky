import { useState, useEffect } from 'react';
import { fetchUSDToSGDRate } from '../utils/currency';

// Cache exchange rate in memory for the session
let cachedRate: number | null = null;
let isFetching = false;

export function useCurrencyRate() {
  const [rate, setRate] = useState<number | null>(cachedRate);
  const [loading, setLoading] = useState(!cachedRate && !isFetching);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we already have a cached rate, use it immediately
    if (cachedRate !== null) {
      setRate(cachedRate);
      setLoading(false);
      return;
    }

    // If already fetching, wait
    if (isFetching) {
      return;
    }

    const fetchRate = async () => {
      isFetching = true;
      setLoading(true);
      try {
        const fetchedRate = await fetchUSDToSGDRate();
        if (fetchedRate !== null) {
          cachedRate = fetchedRate;
          setRate(fetchedRate);
          setError(null);
        } else {
          setError('Failed to fetch exchange rate');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
        isFetching = false;
      }
    };

    fetchRate();
  }, []);

  return { rate, loading, error };
}
