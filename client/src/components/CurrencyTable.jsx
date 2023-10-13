import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CurrencyTable = () => {
    const [currencies, setCurrencies] = useState([]);
    const [sortType, setSortType] = useState('byName');

    const fetchSortedCurrencies = async (type) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/currencies/sort/${type === 'byName' ? 'byName' : 'byValueToUSD'}`);
            setCurrencies(response.data);
        } catch (error) {
            console.error("Error fetching sorted currencies:", error);
        }
    };

    useEffect(() => {
        fetchSortedCurrencies(sortType).then();
    }, [sortType]);

    return (
        <div>
            <label>Sort by:
                <select value={sortType} onChange={e => setSortType(e.target.value)}>
                    <option value="byName">Name</option>
                    <option value="byValueToUSD">Value to USD</option>
                </select>
            </label>

            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Value to USD</th>
                </tr>
                </thead>
                <tbody>
                {currencies.map(currency => (
                    <tr key={currency.Cur_ID}>
                        <td>{currency.Cur_Scale} {currency.Cur_Name}</td>
                        <td>{currency.valueToUSD}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default CurrencyTable;
