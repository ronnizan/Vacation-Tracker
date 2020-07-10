import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './PageNotFound.css'
class PageNotFound extends Component {
    render() {
        return (
            <div className="container-fluid page-not-found">
                <h1><Link className="nav-link" to="/vacations" > Page Not Found!, Click to go back to vacations page</Link> </h1>
            </div>
        );
    }
}

export default PageNotFound;
