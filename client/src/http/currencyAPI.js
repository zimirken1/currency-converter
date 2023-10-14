import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchAllCurrencies = async () => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
};

export const convertCurrency = async (currency, value, toCurrency = null) => {
    const response = await axios.post(`${API_BASE_URL}/convert/${currency}`, { value, toCurrency });
    return response.data;
};

export const fetchSortedCurrencies = async (type) => {
    const response = await axios.get(`${API_BASE_URL}/sort/${type === 'byName' ? 'byName' : 'byValueToUSD'}`);
    return response.data;
};
