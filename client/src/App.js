import React from "react";
import {Route, Routes} from "react-router-dom";
import CurrenciesPage from "./pages/CurrenciesPage";
import ConverterPage from "./pages/ConverterPage";
import NotFoundPage from "./pages/NotFoundPage";
import Navbar from "./components/UI/Navbar";

function App() {
    return (
        <>
            <Navbar/>
            <Routes>
                <Route path="/" element={<CurrenciesPage/>}/>
                <Route path="/converter" element={<ConverterPage/>}/>
                <Route path="*" element={<NotFoundPage/>}/>
            </Routes>
        </>
    );
}

export default App;

