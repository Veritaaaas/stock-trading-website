const api_key = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

const cache = {};

const quote = async (symbol) => {
    const now = Date.now();
    const cacheDuration = 24 * 60 * 60 * 1000;

    if (cache[symbol] && (now - cache[symbol].timestamp < cacheDuration)) {
        return cache[symbol].data;
    }

    try {
        const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${api_key}`);
        const data = await response.json();

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

module.exports = quote;