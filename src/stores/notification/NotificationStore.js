// @flow

import EntityStoreBase from 'stores/EntityStoreBase';
import NotificationConstants from 'constants/notification/NotificationConstants';

class NotificationStore extends EntityStoreBase {

    constructor() {
        super();
        this.subscribe(() => this._registerToActions);
    }

    _registerToActions = (action: {type: string, payload: Object}): void => {
        const {type, payload} = action;
        switch (type) {
            case NotificationConstants.RECEIVE_NOTIFICATIONS:
                this._receiveAllEntities(payload.notifications);
                break;
            case NotificationConstants.RECEIVE_NOTIFICATION:
                this._receiveEntity(payload.notification);
                break;
            case NotificationConstants.DELETE_NOTIFICATION:
                this._deleteEntity(payload.id);
                break;
            default:
                // Do Nothing
                break;
        }
    }

    ///// Public Methods  /////

    /**
     * Get all the notificationes.
     */
    getAll = (): Array<Notification> => {
        return this._entities;
    }

    /**
     * Get a notification by ID.
     * @param  {number} id The identifier of the notification.
     * @return {?Notification}   The notification, or NULL if no notification is found.
     */
    getById = (id: number): ?Notification => {
        return this._entities.find( (e) => e.id === id );
    }

}

export default new NotificationStore();
