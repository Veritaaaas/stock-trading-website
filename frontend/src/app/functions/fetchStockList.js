
const apiKey = process.env.NEXT_PUBLIC_FMP_API_KEY;

const fetchStockList = async () => {

  try {
    const response = await fetch(`https://financialmodelingprep.com/api/v3/stock/list?apikey=${apiKey}`);
    const data = await response.json();
    
    const symbols = data.map(item => item.symbol);

    return symbols;
  }
  catch (error) {
    console.error(error);
    return [];
  }

};

module.exports = fetchStockList;