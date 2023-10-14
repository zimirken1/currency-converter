import React, { useState, useEffect, useCallback } from 'react';
import { fetchAllCurrencies, convertCurrency } from '../http/currencyAPI';
import '../styles/ConverterPage.css'

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
        const fetchData = async () => {
            try {
                const allCurrenciesData = await fetchAllCurrencies();
                setAllCurrencies(allCurrenciesData.map(currency => currency.Cur_Abbreviation));

                const initialConversions = await convertCurrency('USD', '1');
                setValues(prevValues => ({
                    ...prevValues,
                    ...initialConversions
                }));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = useCallback(async (currency, inputValue) => {
        if (!/^[0-9.,]*$/.test(inputValue)) {
            return;
        }

        if (inputValue === '' || inputValue === undefined) {
            setValues(prevValues => ({ ...prevValues, [currency]: '' }));
            return;
        }

        try {
            const baseCurrencyValue = await convertCurrency(currency, inputValue, 'USD');
            const allConversions = await convertCurrency('USD', baseCurrencyValue.USD);
            setValues(prevValues => ({
                ...prevValues,
                ...allConversions
            }));
        } catch (error) {
            console.error("Error converting currency:", error);
        }
    }, []);



    const addCurrency = async () => {
        if (selectedCurrency && !availableCurrencies.includes(selectedCurrency)) {
            setAvailableCurrencies(prevCurrencies => [...prevCurrencies, selectedCurrency]);
            setValues(prevValues => ({ ...prevValues, [selectedCurrency]: '' }));

            try {
                const response = await convertCurrency('USD', values.USD);
                setValues(prevValues => ({
                    ...prevValues,
                    [selectedCurrency]: response[selectedCurrency]
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
        <div className="currency-converter">
            <h2 className="currency-converter__title">Currency Converter</h2>
            <div className="currency-converter__content">
                {availableCurrencies.map(currency => (
                    <div className="currency-converter__item" key={currency}>
                        <label className="currency-converter__label">{currency}:</label>
                        <input
                            className="currency-converter__input"
                            type="text"
                            pattern="^\d*\.?\d*$"
                            value={values[currency] || ''}
                            onChange={e => handleInputChange(currency, e.target.value)}
                        />
                        {!initialCurrencies.includes(currency) && (
                            <button className="currency-converter__remove-button" onClick={() => removeCurrency(currency)}>Remove</button>
                        )}
                    </div>
                ))}
                <div className="currency-converter__controls">
                    <select
                        className="currency-converter__select"
                        value={selectedCurrency}
                        onChange={e => setSelectedCurrency(e.target.value)}
                    >
                        <option value="">Select currency</option>
                        {allCurrencies.filter(currency => !availableCurrencies.includes(currency)).map(currency => (
                            <option key={currency} value={currency}>
                                {currency}
                            </option>
                        ))}
                    </select>
                    <button className="currency-converter__add-button" onClick={addCurrency}>Add Currency</button>
                </div>
            </div>
        </div>
    );
}

export default CurrencyConverter;
