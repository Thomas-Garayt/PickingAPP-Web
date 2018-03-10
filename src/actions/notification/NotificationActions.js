// @flow

import dispatcher from 'dispatchers/AppDispatcher';
import Promise from 'promise';
import ActionsBase from 'actions/ActionsBase';

import NotificationConstants from 'constants/notification/NotificationConstants';
import NotificationService from 'services/notification/NotificationService';

class NotificationActions extends ActionsBase {

    create = (notification: Notification): Promise < * > => {
        const $this = this;
        return new Promise((resolve: (notification: Notification) => void, reject: (response: Object) => void): void => {
            NotificationService.post(notification)
                .then(handleSuccess).catch(handleError);

            function handleSuccess(newNotification: Notification): void {
                dispatcher.dispatch({
                    type: NotificationConstants.RECEIVE_NOTIFICATION,
                    payload: {
                        notification: newNotification
                    }
                });
                resolve(newNotification);
            }

            function handleError(err: Object): void {
                $this.handleError(err, reject);
            }
        });
    }
    edit = (id: number, notification: Object): Promise < * > => {
        const $this = this;
        return new Promise((resolve: (notification: Notification) => void, reject: (response: Object) => void): void => {
            NotificationService.patch(id, notification)
                .then(handleSuccess).catch(handleError);

            function handleSuccess(newNotification: Notification): void {
                dispatcher.dispatch({
                    type: NotificationConstants.RECEIVE_NOTIFICATION,
                    payload: {
                        notification: newNotification
                    }
                });
                resolve(newNotification);
            }

            function handleError(err: Object): void {
                $this.handleError(err, reject);
            }
        });
    }
    delete = (id: number): Promise < * > => {
        const $this = this;
        return new Promise((resolve: () => void, reject: (response: Object) => void): void => {
            NotificationService.remove(id)
                .then(handleSuccess).catch(handleError);

            function handleSuccess(): void {
                dispatcher.dispatch({
                    type: NotificationConstants.DELETE_NOTIFICATION,
                    payload: {
                        id: id
                    }
                });
                resolve();
            }

            function handleError(err: Object): void {
                $this.handleError(err, reject);
            }
        });
    }
    reload = (): Promise < * > => {
        const $this = this;
        return new Promise((resolve: () => void, reject: (response: Object) => void): void => {
            NotificationService.getAll()
                .then(handleSuccess).catch(handleError);

            function handleSuccess(notifications: Array < Notification > ): void {
                dispatcher.dispatch({
                    type: NotificationConstants.RECEIVE_NOTIFICATIONS,
                    payload: {
                        notifications: notifications
                    }
                });
                resolve();
            }

            function handleError(err: Object): void {
                $this.handleError(err, reject);
            }
        });
    }

}

export default new NotificationActions();
