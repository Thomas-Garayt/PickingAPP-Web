// @flow

import EntityStoreBase from 'stores/EntityStoreBase';
import UserConstants from 'constants/user/UserConstants';

class UserStore extends EntityStoreBase<User> {
    _subordonates: { [user_id: number]: User[] };

    constructor() {
        super(([]: Array<User>));
        this.subscribe(() => this._registerToActions);
        this._subordonates = {};
    }

    _registerToActions = (action: { type: string, payload: Object }): void => {
        const { type, payload } = action;
        switch (type) {
        case UserConstants.RECEIVE_USERS:
            this._receiveAllEntities(payload.users);
            break;
        case UserConstants.RECEIVE_USER:
            this._receiveUser(payload.user);
            break;
        case UserConstants.RECEIVE_USER_SUBORDONATES:
            this._receiveUserSubordonates(payload.userId, payload.subordonates);
            break;
        case UserConstants.DELETE_USER:
            this._deleteUser(payload.id);
            break;

            // Roles
        case UserConstants.ADD_USER_ROLE:
            this._addUserRole(payload.userId, payload.roleId);
            break;
        case UserConstants.REMOVE_USER_ROLE:
            this._removeUserRole(payload.userId, payload.roleId);
            break;

            // Passwords
        case UserConstants.RESET_PASSWORD:
            this._updateUserPassword(payload.userId, payload.userPassword);
            break;

        default:
                // Do Nothing
            break;
        }
    };

    _deleteUser(userId: number): void {
        const keys = Object.keys(this._subordonates);
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            const subordonates = this._subordonates[k];

            const iSub = subordonates.findIndex(e => e.id === userId);
            if (iSub > -1) {
                this._entities.splice(iSub, 1);
            }
        }

        this._deleteEntity(userId);
    }

    _receiveUser(user: User): void {
        const keys = Object.keys(this._subordonates);
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            const subordonates = this._subordonates[k];
            for (let j = 0; j < subordonates.length; j++) {
                if (subordonates[j].id === user.id) {
                    subordonates[j] = user;
                }
            }
        }

        this._receiveEntity(user);
    }

    _receiveUserSubordonates(userId: number, subordonates: User[]): void {
        this._subordonates[userId] = subordonates.filter(s => s.id !== userId);
        this._receiveSomeEntities(subordonates);
    }

    // Roles
    _addUserRole(userId: number, roleId: number): void {
        const user: ?User = this.getById(userId);
        if (!user) {
            return;
        }
        if (!user.roles) {
            user.roles = [];
        }

        const i = user.roles.findIndex(r => r.id === roleId);
        if (i < 0) {
            user.roles.push({ id: roleId });
        }

        this.emitChange();
    }

    _removeUserRole(userId: number, roleId: number): void {
        const user: ?User = this.getById(userId);
        if (!user || !user.roles) {
            return;
        }

        const i = user.roles.findIndex(r => r.id === roleId);
        if (i > -1) {
            user.roles.splice(i, 1);
            this.emitChange();
        }
    }

    // Passwords
    _updateUserPassword(userId: number, userPassword: string): void {
        this.emitChange();
    }

    // /// Public Methods  /////

    /**
     * Get all the users.
     */
    getAll = (): Array<User> => this._entities;

    /**
     * Get a user by ID.
     * @param {number} id The identifier of the user.
     * @return {?User}    The user, or NULL if no entity is found.
     */
    getById = (id: number): ?User => this._entities.find(e => e.id === id);

    getSubordonatesOfUser = (user: ?User): User[] =>
        user ? this._subordonates[user.id] || [] : [];
}

export default new UserStore();
