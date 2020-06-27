import { popUpAlert } from './alert-actions';
import { REGISTER_SUCCUSS, REGISTER_FAIL, USER_LOADED, LOGIN_SUCCUSS, LOGIN_FAIL, LOGOUT,AUTH_ERROR, AppActions } from '../types/auth/auth-actions-types';
import { Dispatch } from 'redux';
import { AppState } from '../store/store';
import axios from 'axios';
import setAuthToken from '../../utills/setAuthToken';
import { Config } from '../../config';


// export const userLoad = (user: User): AppActions => ({
//     type: USER_LOADED,
//     payload: user
// });
// export const login = (user: User): AppActions => ({
//     type: LOGIN_SUCCUSS,
//     payload: user
// });
// export const register = (token: { token: string }): AppActions => ({
//     type: REGISTER_SUCCUSS,
//     payload: token.token
// });


export const loadUser = () => async (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }
    try {
        const res = await axios.get(Config.serverUrl +"/api/auth/user");
        dispatch({
            type: USER_LOADED,
            payload: res.data
        });
    } catch (error) {
        console.log("in load")
        dispatch({
            type: AUTH_ERROR
        });
    }
};



export const registerUser = ({ firstName, lastName, username, password }: {
    firstName: string,
    lastName: string,
    username: string,
    password: string
}) => {
    return async (dispatch: Dispatch<any>, getState: () => AppState) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const body = JSON.stringify({ firstName, lastName, username, password });
            const res = await axios.post(Config.serverUrl + "/api/auth/register", body, config);
            dispatch({
                type: REGISTER_SUCCUSS,
                payload: res.data.token
            });
            dispatch(loadUser());
            dispatch(popUpAlert({msg:"You Have Been Successfully Registered",alertType:"success",timeout:5000}))
        } catch (error) {
            console.log(error)

            const errors = error.response.data.errors;
            if (errors) {
                errors.forEach((err: { msg: string; }) => dispatch(popUpAlert({ timeout: 5000, msg: err.msg, alertType: "danger" })));
            } else {
                dispatch(popUpAlert({ timeout: 5000, msg: "Register User failed.., Please try again", alertType: "danger" }));
            }
            dispatch({
                type: REGISTER_FAIL,
            });
        }
    };
};


export const loginUser = (username: string, password: string) => {
    return async (dispatch: Dispatch<any>, getState: () => AppState) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const body = JSON.stringify({ username, password });
            const res = await axios.post(Config.serverUrl + "/api/auth/login", body, config);
            dispatch({
                type: LOGIN_SUCCUSS,
                payload: res.data.token
            });
            dispatch(loadUser());
            dispatch(popUpAlert({msg:"You Have Been Successfully Logged In",alertType:"success",timeout:8000}))

        } catch (error) {
            console.log(error)

            const errors = error.response.data.errors;
            if (errors) {
                errors.forEach((err: { msg: string; }) => dispatch(popUpAlert({ timeout: 8000, msg: err.msg, alertType: "danger" })));
            } else {
                dispatch(popUpAlert({ timeout: 8000, msg: "Login User failed.., Please try again", alertType: "danger" }));
            }
            dispatch({
                type: LOGIN_FAIL,
            });
        }
    };
};


export const logoutUser = () => {
    return (dispatch: Dispatch<any>, getState: () => AppState) => {
        dispatch({
            type: LOGOUT
        });
        dispatch(popUpAlert({ timeout: 8000, msg: "You Have Been Successfully Logged Out", alertType: "danger" }));

    };
};