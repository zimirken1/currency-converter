import React from 'react';
import CurrencyTable from "../components/CurrencyTable";
import '../styles/CurrenciesPage.css'

const CurrenciesPage = () => {
    return (
        <div className={"currency-page"}>
            <h1 className={"currency-page__title"}>Currency Rates to 1 USD</h1>
            <CurrencyTable />
        </div>
    );
};

export default CurrenciesPage;