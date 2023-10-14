import React from 'react';
import {Link} from "react-router-dom";
import classes from './Navbar.module.css'

const Navbar = () => {
    return (
        <div className={classes.navbar}>
            <div className={classes.navbar__items}>
                <Link className={classes.link} to={"/"}>Currencies</Link>
                <Link className={classes.link} to={"/converter"}>Converter</Link>
            </div>
        </div>
    );
};

export default Navbar;