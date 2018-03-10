// @flow

import ServiceBase from 'services/ServiceBase';
import BaseUrlConstants from 'constants/BaseUrlConstants';

const API_URL: string = BaseUrlConstants.BASE_URL;
const NOTIFICATION_URL: string = API_URL + 'notifications';

class NotificationService extends ServiceBase {
    constructor() {
        super(NOTIFICATION_URL);
    }

}

export default new NotificationService();
