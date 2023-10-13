import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CurrencyConverter = () => {
    const initialCurrencies = ['USD', 'EUR', 'RUB', 'BYN'];

    const [values, setValues] = useState({
        USD: '1',
        EUR: '',
        RUB: '',
        BYN: ''
    });
    const [availableCurrencies, setAvailableCurrencies] = useState(initialCurrencies);
    const [allCurrencies, setAllCurrencies] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState('');

    useEffect(() => {
        const fetchAllCurrencies = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/currencies');
                setAllCurrencies(response.data.map(currency => currency.Cur_Abbreviation));
            } catch (error) {
                console.error("Error fetching all currencies:", error);
            }
        };

        const fetchInitialConversions = async () => {
            try {
                const response = await axios.post(`http://localhost:8000/api/currencies/convert/USD`, { value: '1' });
                setValues(prevValues => ({
                    ...prevValues,
                    ...response.data
                }));
            } catch (error) {
                console.error("Error fetching initial conversions:", error);
            }
        };

        fetchAllCurrencies();
        fetchInitialConversions();
    }, []);

    const handleInputChange = async (currency, inputValue) => {
        if (inputValue === '' || inputValue === undefined) {
            setValues(prevValues => ({ ...prevValues, [currency]: '' }));
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8000/api/currencies/convert/${currency}`, { value: inputValue });
            setValues(prevValues => ({
                ...prevValues,
                ...response.data
            }));
        } catch (error) {
            console.error("Error converting currency:", error);
        }
    };

    const addCurrency = async () => {
        if (selectedCurrency && !availableCurrencies.includes(selectedCurrency)) {
            setAvailableCurrencies(prevCurrencies => [...prevCurrencies, selectedCurrency]);
            setValues(prevValues => ({ ...prevValues, [selectedCurrency]: '' }));

            try {
                // Производим расчет для новой валюты на основе значения в USD
                const response = await axios.post(`http://localhost:8000/api/currencies/convert/USD`, { value: values.USD });
                setValues(prevValues => ({
                    ...prevValues,
                    [selectedCurrency]: response.data[selectedCurrency]
                }));
            } catch (error) {
                console.error("Error converting for new currency:", error);
            }
        }
    };
    const removeCurrency = (currencyToRemove) => {
        setAvailableCurrencies(prevCurrencies => prevCurrencies.filter(currency => currency !== currencyToRemove));
        setValues(prevValues => {
            const updatedValues = { ...prevValues };
            delete updatedValues[currencyToRemove];
            return updatedValues;
        });
    };

    return (
        <div>
            <h2>Currency Converter</h2>
            <div>
                {availableCurrencies.map(currency => (
                    <div key={currency} style={{ marginBottom: "10px" }}>
                        <label>{currency}:</label>
                        <input
                            type="number"
                            value={values[currency] || ''}
                            onChange={e => handleInputChange(currency, e.target.value)}
                        />
                        {/* Показываем кнопку удаления только если это не одна из исходных валют */}
                        {!initialCurrencies.includes(currency) && (
                            <button onClick={() => removeCurrency(currency)}>Remove</button>
                        )}
                    </div>
                ))}
                <div>
                    <select value={selectedCurrency} onChange={e => setSelectedCurrency(e.target.value)}>
                        <option value="">Select currency</option>
                        {allCurrencies.filter(currency => !availableCurrencies.includes(currency)).map(currency => (
                            <option key={currency} value={currency}>
                                {currency}
                            </option>
                        ))}
                    </select>
                    <button onClick={addCurrency}>Add Currency</button>
                </div>
            </div>
        </div>
    );

}

export default CurrencyConverter;
