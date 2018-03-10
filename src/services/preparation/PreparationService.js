// @flow

import ServiceBase from 'services/ServiceBase';
import BaseUrlConstants from 'constants/BaseUrlConstants';

const API_URL: string = BaseUrlConstants.BASE_URL;
const PREPARATION_URL: string = API_URL + 'preparations';

class PreparationService extends ServiceBase {
    constructor() {
        super(PREPARATION_URL);
    }

    /**
     * Get all the preparation currently underway
     *
     * @returns {Promise}       A promise to handle the request ascynchronously.
     */
    getNoFinished(): Promise<*> {
        return this.execute({
            url: `${PREPARATION_URL}/notfinished`,
            method: 'GET',
        });
    }


}

export default new PreparationService();
