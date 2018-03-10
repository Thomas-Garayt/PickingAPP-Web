// @flow

import dispatcher from 'dispatchers/AppDispatcher';
import Promise from 'promise';
import ActionsBase from 'actions/ActionsBase';

import UserConstants from 'constants/user/UserConstants';
import UserService from 'services/user/UserService';

import RoleConstants from 'constants/permission/RoleConstants';

import LoginStore from 'stores/LoginStore';

class UserActions extends ActionsBase {
    create = (user: User): Promise<*> => {
        const $this = this;
        return new Promise(
            (resolve: (user: User) => void, reject: (response: Object) => void): void => {

                function handleSuccess(newUser: User): void {
                    dispatcher.dispatch({
                        type: UserConstants.RECEIVE_USER,
                        payload: {
                            user: newUser,
                        },
                    });

                    const myId = LoginStore.getUser() ? LoginStore.getUser().id : null;
                    $this.reloadSubordonates(myId);

                    resolve(newUser);
                }

                function handleError(err: Object): void {
                    $this.handleError(err, reject);
                }

                UserService.post(user).then(handleSuccess).catch(handleError);
            },
        );
    };
    edit = (id: number, user: User): Promise<*> => {
        const $this = this;
        return new Promise(
            (resolve: (user: User) => void, reject: (response: Object) => void): void => {
                UserService.patch(id, user).then(handleSuccess).catch(handleError);

                function handleSuccess(newUser: User): void {
                    dispatcher.dispatch({
                        type: UserConstants.RECEIVE_USER,
                        payload: {
                            user: newUser,
                        },
                    });
                    resolve(newUser);
                }

                function handleError(err: Object): void {
                    $this.handleError(err, reject);
                }
            },
        );
    };
    delete = (id: number): Promise<*> => {
        const $this = this;
        return new Promise((resolve: () => void, reject: (response: Object) => void): void => {
            UserService.remove(id).then(handleSuccess).catch(handleError);

            function handleSuccess(): void {
                dispatcher.dispatch({
                    type: UserConstants.DELETE_USER,
                    payload: {
                        id,
                    },
                });
                resolve();
            }

            function handleError(err: Object): void {
                $this.handleError(err, reject);
            }
        });
    };
    reload = (): Promise<*> => {
        const $this = this;
        return new Promise((resolve: () => void, reject: (response: Object) => void): void => {
            UserService.getAll().then(handleSuccess).catch(handleError);

            function handleSuccess(users: Array<User>): void {
                dispatcher.dispatch({
                    type: UserConstants.RECEIVE_USERS,
                    payload: {
                        users,
                    },
                });
                resolve();
            }

            function handleError(err: Object): void {
                $this.handleError(err, reject);
            }
        });
    };

    reloadById = (userId: number): Promise<*> => {
        const $this = this;
        return new Promise((resolve: () => void, reject: (response: Object) => void): void => {

            function handleSuccess(user: User): void {
                dispatcher.dispatch({
                    type: UserConstants.RECEIVE_USER,
                    payload: {
                        user,
                    },
                });
                resolve();
            }

            function handleError(err: Object): void {
                $this.handleError(err, reject);
            }

            UserService.getById(userId).then(handleSuccess).catch(handleError);
        });
    };

    reloadSubordonates = (userId: number): Promise<*> => {
        const $this = this;
        return new Promise((resolve: () => void, reject: (response: Object) => void): void => {
            function handleSuccess(subordonates: Array<User>): void {
                dispatcher.dispatch({
                    type: UserConstants.RECEIVE_USER_SUBORDONATES,
                    payload: {
                        userId,
                        subordonates,
                    },
                });
                resolve();
            }

            function handleError(err: Object): void {
                $this.handleError(err, reject);
            }

            UserService.getSubordonates(userId).then(handleSuccess).catch(handleError);
        });
    };

    // Roles

    /**
     * Add a role to a user.
     * @param {number} userId The user identifier.
     * @param {number} roleId The identfier of the role to add.
     * @returns {Promise}
     */
    addRole = (userId: number, roleId: number): Promise<*> =>
        new Promise((resolve: () => void, reject: (response: Object) => void): void => {
            UserService.addRole(userId, roleId).then(handleSuccess).catch(handleError);

            function handleSuccess(newRole: Role): void {
                dispatcher.dispatch({
                    type: UserConstants.ADD_USER_ROLE,
                    payload: {
                        userId,
                        roleId: newRole.id,
                    },
                });

                dispatcher.dispatch({
                    type: RoleConstants.RECEIVE_ROLE,
                    payload: {
                        role: newRole,
                    },
                });

                resolve();
            }

            function handleError(err: Object): void {
                this.handleError(err, reject);
            }
        });

    /**
     * Remove a role from a user. It do not delete the specified role.
     * @param {number} userId The identifier of the company.
     * @param {number} roleId The identifier of the role.
     * @returns {Promise}
     */
    removeRole = (userId: number, roleId: number): Promise<*> =>
        new Promise((resolve: () => void, reject: (response: Object) => void): void => {
            UserService.removeRole(userId, roleId).then(handleSuccess).catch(handleError);

            function handleSuccess(): void {
                dispatcher.dispatch({
                    type: UserConstants.REMOVE_USER_ROLE,
                    payload: {
                        userId,
                        roleId,
                    },
                });
                resolve();
            }

            function handleError(err: Object): void {
                this.handleError(err, reject);
            }
        });

    updatePassword = (userId: number, userPassword: Object): Promise<*> => {
        const $this = this;
        return new Promise((resolve: () => void, reject: (response: Object) => void): void => {
            function handleSuccess() {
                dispatcher.dispatch({
                    type: UserConstants.RESET_PASSWORD,
                    payload: {
                        userId,
                        userPassword,
                    },
                });
                resolve();
            }

            function handleError(err: Object): void {
                $this.handleError(err, reject);
            }

            UserService.updatePassword(userId, userPassword).then(handleSuccess).catch(handleError);
        });
    };
}

export default new UserActions();
