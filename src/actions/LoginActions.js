// @flow
/* global localStorage */

import AppDispatcher from 'dispatchers/AppDispatcher.js';
import Login from 'constants/LoginConstants.js';
import { hashHistory } from 'react-router';

import ToastActions from 'actions/ToastActions';
import TokenContainer from 'services/TokenContainer';

// Here a token is valid for 12 hours.
const TOKEN_VALIDITY_DURATION = 43200000;

class LoginActions {
    loginUser = (jwt: string, user: User, securityContext: Object): void => {
        const savedJwt = localStorage.getItem('jwt');

        TokenContainer.set(jwt);

        AppDispatcher.dispatch({
            type: Login.LOGIN_USER,
            payload: {
                jwt,
                user,
                securityContext,
            },
        });

        if (savedJwt !== jwt) {
            localStorage.setItem('jwt', jwt);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('security-context', JSON.stringify(securityContext));
            localStorage.setItem('created-at', Date.now().toString());

            const query = hashHistory.getCurrentLocation().query;
            const returnTo = query.return_to ? query.return_to : '/';
            hashHistory.push(returnTo);
        }
    };

    loginUserIfRemembered = (): void => {
        // Check is user is remembered
        const createdAt = localStorage.getItem('created-at');
        if (Date.now() - createdAt > TOKEN_VALIDITY_DURATION) {
            return;
        }

        const jwt = localStorage.getItem('jwt');
        const user = localStorage.getItem('user');
        const securityContext = localStorage.getItem('security-context');
        if (jwt && user && securityContext) {
            this.loginUser(jwt, JSON.parse(user), JSON.parse(securityContext));
        }
    };

    logoutUser = (): void => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        localStorage.removeItem('security-context');
        localStorage.removeItem('created-at');
        AppDispatcher.dispatch({
            type: Login.LOGOUT_USER,
            payload: {},
        });
        hashHistory.push('/login');
    };

    logoutIfUnauthorized = (err: Object): void => {
        // If the error is Unauthorized, it means that the token isn't valid.
        // So we logout the user to let him reconnect.
        if (err && err.status === 401) {
            if (localStorage.getItem('user') != null) {
                ToastActions.createToastError('You have to login to access the application.', '');
                this.logoutUser();
            }
        }
    };
}

export default new LoginActions();
