// @flow

// $FlowIgnoreMe
import request from 'reqwest';
import when from 'when';
import Login, {LOGIN_URL, SIGNUP_URL} from 'constants/LoginConstants';
import LoginActions from 'actions/LoginActions';

class AuthService {

    /**
     * Try to log the user to the application.
     * @param  {string} login    The login or email.
     * @param  {string} password The plain password.
     * @return {Promise}         A promise of the request.
     */
    login(login: string, password: string): Promise<*> {
        return this.handleAuth(when(request({
            url: Login.LOGIN_URL,
            method: 'POST',
            crossOrigin: true,
            type: 'json',
            data: {
                login, password
            }
        })));
    }

    /**
     * Log out the user from the application.
     */
    logout(): void {
        LoginActions.logoutUser();
    }

    /**
     * Handle the promise of the API request to log the user in.
     * @param  {Promise} loginPromise The promise of the API request.
     * @return {Promise}              The same promise, to allow catching error after.
     */
    handleAuth(loginPromise: Promise<*>) {
        return loginPromise
            .then(function (response) {
                const jwt = response.value;
                const user = response.user;
                const securityContext = response.securityContext;
                LoginActions.loginUser(jwt, user, securityContext);
                return true;
            });
    }
}

export default new AuthService()
