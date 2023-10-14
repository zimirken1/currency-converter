import React from 'react';
import {Link} from "react-router-dom";
import '../App.css'

const NotFoundPage = () => {
    return (
        <div className={'not-found-page'}>
            This page doesn't exist
            <Link to="/">home</Link>
        </div>
    );
};

export default NotFoundPage;