// @flow

import Login, {LOGIN_USER, LOGOUT_USER} from 'constants/LoginConstants';
import BaseStore from 'stores/BaseStore';

class LoginStore extends BaseStore {

    _user: ?User;
    _jwt: ?string;
    _securityContext: ?Object;

    constructor() {
        super();
        this.subscribe(() => this._registerToActions.bind(this));
        this._user = null;
        this._jwt = null;
        this._securityContext = null;
    }

    _registerToActions(action: {type: string, payload: Object}): void {
        const {type, payload} = action;
        switch (type) {
            case Login.LOGIN_USER:
                this._jwt = payload.jwt;
                this._user = payload.user;
                this._securityContext = payload.securityContext;
                this.emitChange();
                break;
            case Login.LOGOUT_USER:
                this._user = null;
                this.emitChange();
                break;
            default:
                break;
        }
    }

    getUser(): ?User {
        return this._user;
    }

    getJwt(): ?string {
        return this._jwt;
    }

    getSecurityContext(): ?Object {
        return this._securityContext;
    }

    isLoggedIn(): boolean {
        return !!this._user;
    }
}

export default new LoginStore();
