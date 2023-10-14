import React, { useState, useEffect } from 'react';
import {fetchSortedCurrencies} from "../http/currencyAPI";
import '../styles/CurrenciesPage.css'

const CurrencyTable = () => {
    const [currencies, setCurrencies] = useState([]);
    const [sortType, setSortType] = useState('byName');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sortedCurrencies = await fetchSortedCurrencies(sortType);
                setCurrencies(sortedCurrencies);
            } catch (error) {
                console.error("Error fetching sorted currencies:", error);
            }
        };

        fetchData();
    }, [sortType]);

    return (
        <div>
            <label>Sort by:
                <select className={"sort-type"} value={sortType} onChange={e => setSortType(e.target.value)}>
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
