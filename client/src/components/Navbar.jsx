import React from 'react';
import {Link} from "react-router-dom";

const Navbar = () => {
    return (
        <div>
            <Link to={"/"}>Currencies</Link>
            <Link to={"/converter"}>Converter</Link>
        </div>
    );
};

export default Navbar;