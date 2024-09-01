const apiKey = process.env.NEXT_PUBLIC_FMP_API_KEY;

const cache = {};

const fetchStockData = async (symbol) => {
  const now = Date.now();
  const cacheDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  // Check if the symbol is in the cache and if the cache is still valid
  if (cache[symbol] && (now - cache[symbol].timestamp < cacheDuration)) {
    return cache[symbol].data;
  }

  try {
    const response = await fetch(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apiKey}`);
    const data = await response.json();

    // Update the cache with the new data and timestamp
    cache[symbol] = {
      data,
      timestamp: now
    };

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

module.exports = fetchStockData;