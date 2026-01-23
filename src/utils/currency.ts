/**
 * Fetch USD to SGD exchange rate from free API
 */
export async function fetchUSDToSGDRate(): Promise<number | null> {
  try {
    const response = await fetch(
      'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json'
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const rate = data.usd?.sgd;

    if (!rate || typeof rate !== 'number') {
      throw new Error('Invalid rate data');
    }

    return rate;
  } catch (error) {
    console.error('Failed to fetch USD to SGD rate:', error);
    return null;
  }
}

/**
 * Convert USD to SGD using provided rate
 */
export function convertUSDToSGD(usdAmount: number, rate: number): number {
  return usdAmount * rate;
}
