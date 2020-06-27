
import React, { Component } from 'react';
import "./Navbar.css"
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logoutUser } from '../../redux/actions/auth-actions';
import { ThunkDispatch } from 'redux-thunk';
import { AppActions } from '../../redux/types/auth/auth-actions-types';
import { AppState } from '../../redux/store/store';
import { Auth } from '../../redux/types/auth/auth-type';


type Props = LinkDispatchProps & LinkStateProps;


class Navbar extends React.Component<Props> {
    constructor(props: Props) {
        super(props);

    }

    render() { 
        const { logoutUser, auth } = this.props;
        
        const authLinks =
            (<ul className="navbar-nav mr-auto">
                <li className="nav-item">
                    <button className="nav-link button-navbar-username">Hello {auth.user.firstName}
                    </button>
                </li>
                {/* <li className="nav-item">
                    <Link to="/" className="nav-link">Home
                     <span className="sr-only">(current)</span>
                    </Link>
                </li> */}
                <li className="nav-item">
                    <Link to="/vacations" className="nav-link">Vacations</Link>
                </li>
                {
                    auth.isAuthenticated && auth.user.isAdmin === 1 && (
                        <>
                            <li className="nav-item">
                                <Link to="/vacations" className="nav-link">Add Vacation</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/vacations" className="nav-link">Vacation Tracker</Link>
                            </li>
                        </>
                    )
                }
                <li className="nav-item">
                    <button onClick={() => {
                        logoutUser();
                        
                        
                    }} className="button-navbar nav-link ">Logout</button>
                </li>
            </ul>
            )
        const guestLinks =
            (<ul className="navbar-nav mr-auto">
                <li className="nav-item">
                    <Link to="/" className="nav-link">Home
             <span className="sr-only">(current)</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/login" className="nav-link">Sign In</Link>
                </li>
                <li className="nav-item">
                    <Link to="/register" className="nav-link">Register</Link>
                </li>
                <li className="nav-item">
                    <Link to="/vacations" className="nav-link">Vacations</Link>
                </li>
            </ul>
            )

        return (

            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark static-top ">
                    <div className="container">
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon" />
                        </button>
                        <div className="collapse navbar-collapse" id="navbarResponsive">
                            {!auth.loading &&
                                auth.isAuthenticated ? authLinks : guestLinks
                            }
                        </div>
                    </div>
                </nav>
                <br />
            </div>



        );
    }
}

interface LinkStateProps {
    auth: Auth
}

const mapStateToProps = (
    state: AppState,
): LinkStateProps => ({
    auth: state.auth
});

interface LinkDispatchProps {
    logoutUser?: () => void

}

const mapDispatchToProps = (
    dispatch: ThunkDispatch<any, any, AppActions>
): LinkDispatchProps => ({
    logoutUser: bindActionCreators(logoutUser, dispatch)
});
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Navbar);
