// @flow

import ServiceBase from 'services/ServiceBase';
import BaseUrlConstants from 'constants/BaseUrlConstants';

const USERS_URL: string = `${BaseUrlConstants.BASE_URL}users`;

class AbsenceService extends ServiceBase {
    constructor() {
        super(USERS_URL);
    }

    /**
     * Get all absence from a user.
     *
     * @param   {number} userId The identifier of the user.
     * @returns {Promise}       A promise to handle the request ascynchronously.
     */
    getByUser(userId: number): Promise<*> {
        return this.execute({
            url: `${USERS_URL}/${userId}/absences`,
            method: 'GET',
        });
    }

    /**
     * Post a new clocking validation to a user.
     *
     * @param   {number} userId The identifier of the user
     * @param   {Object} counter  The validation to add.
     * @returns {Promise}       A promise to handle the request ascynchronously.
     */
    postToUser(userId: number, counter: Object): Promise<*> {
        return this.execute({
            url: `${USERS_URL}/${userId}/absences`,
            method: 'POST',
            data: counter,
        });
    }

    /**
     * Patch an existing resource. Only the properties that are set on the patch will be updated.
     *
     * @param   {number} userId The identifier of the user
     * @param   {number} id     The identifier of the counter.
     * @param   {Object}  patch The properties to update.
     * @returns {Promise}       A promise to handle the request ascynchronously.
     */
    patchToUser(userId: number, id: number, patch: Object): Promise<*> {
        return this.execute({
            url: `${USERS_URL}/${userId}/absences/${id}`,
            method: 'PATCH',
            data: patch,
        });
    }

    /**
     * Post a new clocking validation to a user.
     *
     * @param   {number} userId The identifier of the user
     * @param   {number} id     The identifier of the counter.
     * @returns {Promise}       A promise to handle the request ascynchronously.
     */
    removeFromUser(userId: number, id: number): Promise<*> {
        return this.execute({
            url: `${USERS_URL}/${userId}/absences/${id}`,
            method: 'DELETE',
        });
    }
}

export default new AbsenceService();
