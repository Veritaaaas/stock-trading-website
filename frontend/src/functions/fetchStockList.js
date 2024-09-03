const apiKey = process.env.NEXT_PUBLIC_FMP_API_KEY;

let cachedSymbols = null;

const fetchStockList = async () => {
  if (cachedSymbols) {
    return cachedSymbols;
  }

  try {
    const response = await fetch(`https://financialmodelingprep.com/api/v3/stock/list?apikey=${apiKey}`);
    const data = await response.json();
    
    const symbols = data.map(item => item.symbol);
    cachedSymbols = symbols; // Cache the symbols

    return symbols;
  } catch (error) {
    console.error(error);
    return [];
  }
};

module.exports = fetchStockList;