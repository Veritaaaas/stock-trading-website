const api_key = process.env.NEXT_PUBLIC_TWELVE_DATA_API_KEY;

if (!api_key) {
    console.error('API key is not set. Please set the NEXT_PUBLIC_RAPIDAPI_KEY environment variable.');
}

const fetchTimeSeries = async (symbol, interval) => {
    const url = `https://twelve-data1.p.rapidapi.com/time_series?outputsize=5000&symbol=${symbol}&interval=${interval}&format=json`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': api_key,
            'x-rapidapi-host': 'twelve-data1.p.rapidapi.com'
        }
    };

    try {
        console.log(`Using API key: ${api_key}`); // Log the API key for debugging

        const response = await fetch(url, options);
        const data = await response.json();

        if (data.status === 'error') {
            throw new Error(data.message);
        }

        const formattedData = data.values.map((value) => ({
            time: value.datetime.split('T')[0], // Extracts the date part in YYYY-MM-DD format
            value: parseFloat(value.close) // Ensures the value is a number
        }));

        // Sort the formatted data by date in ascending order
        formattedData.sort((a, b) => new Date(a.time) - new Date(b.time));

        return formattedData;
    } catch (error) {
        console.error('Error fetching time series data:', error);
        return [];
    }
};

module.exports = fetchTimeSeries;