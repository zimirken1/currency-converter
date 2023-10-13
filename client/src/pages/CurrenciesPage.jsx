import React from 'react';
import CurrencyTable from "../components/CurrencyTable";

const CurrenciesPage = () => {
    return (
        <>
            <h1>Currency Rates to 1 USD</h1>
            <CurrencyTable />
        </>
    );
};

export default CurrenciesPage;