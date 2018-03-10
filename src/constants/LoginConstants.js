import BaseUrlContacts from '../constants/BaseUrlConstants';

export default {
    BASE_URL: BaseUrlContacts.BASE_URL,
    LOGIN_URL: BaseUrlContacts.BASE_URL + 'auth-tokens',
    SIGNUP_URL: BaseUrlContacts.BASE_URL + 'users',
    
    LOGIN_USER: 'LOGIN_USER',
    LOGOUT_USER: 'LOGOUT_USER'
}
