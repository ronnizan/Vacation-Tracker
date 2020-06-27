
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import './Layout.css'
import Test from '../test';
import Alert from '../Alert/Alert';
import store from '../../redux/store/store';
import setAuthToken from '../../utills/setAuthToken';
import { loadUser } from '../../redux/actions/auth-actions';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import LoginPage from '../Login/LoginPage';
import VacationPage from '../Vacations-page/VacationPage';
import LoggedUser from '../Private-routing/LoggedUser';
import Navbar from '../Navbar/Navbar';
import LandingPage from '../Landing-Page/LandingPage';
import Register from '../Register/RegisterPage';
import AdminRoute from '../Private-routing/AdminRoute';
import AdminPage from '../Admin/AdminPage';
if (localStorage.token) {
    setAuthToken(localStorage.token);
}
class Layout extends Component {
    componentDidMount() {
        if (localStorage.token) {

            store.dispatch(loadUser())
        }
    }
    componentDidUpdate() {
        if (localStorage.token) {

            store.dispatch(loadUser())
        }
    }
    render() {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <Navbar></Navbar>
                    <Test></Test>
                    <section className='container'></section>
                    <Alert />
                    <section className="container-fluid">
                        <Switch>
                            <Route path="/" component={LandingPage} exact></Route>
                            <Route path="/login" component={LoginPage} exact></Route>
                            <Route path="/register" component={Register} exact></Route>
                            <LoggedUser path="/vacations" component={VacationPage} exact></LoggedUser>
                           <AdminRoute path="/admin" component={AdminPage} exact></AdminRoute>
                        </Switch>
                    </section>
                </BrowserRouter>
            </Provider>
        );
    }
}
export default Layout;







