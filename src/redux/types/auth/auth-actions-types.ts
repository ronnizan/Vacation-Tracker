import { Auth } from './auth-type';
import { UserModel as User } from '../../../models/user-model';
import { AlertActionTypes } from '../alert/alert-actions-types';
export const REGISTER_SUCCUSS = 'REGISTER_SUCCUSS';
export const REGISTER_FAIL = 'REGISTER_FAIL';
export const USER_LOADED = 'USER_LOADED';
export const AUTH_ERROR = 'AUTH_ERROR';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGIN_SUCCUSS = 'LOGIN_SUCCUSS';
export const LOGOUT = 'LOGOUT';

export interface RegisterSuccussAction {
    type: typeof REGISTER_SUCCUSS;
    payload: string;
}
export interface UserLoadedAction {
    type: typeof USER_LOADED;
    payload: object;
    // userId(pin):29
    // firstName(pin):"111111"
    // lastName(pin):"22asdasd22"
    // username(pin):"231112456"
    // isAdmin(pin):0
}


export interface RegisterFailAction {
    type: typeof REGISTER_FAIL;
}

export interface AuthErrorAction {
    type: typeof AUTH_ERROR;
}
export interface LoginSuccussAction {
    type: typeof LOGIN_SUCCUSS;
    payload: string
}
export interface LoginFailAction {
    type: typeof LOGIN_FAIL;
}
export interface LogoutAction {
    type: typeof LOGOUT;
}

export type AuthActionTypes = RegisterSuccussAction | RegisterFailAction | UserLoadedAction | AuthErrorAction | LoginSuccussAction | LoginFailAction | LogoutAction



export type AppActions = AuthActionTypes | AlertActionTypes