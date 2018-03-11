// @flow

import ServiceBase from 'services/ServiceBase';
import BaseUrlConstants from 'constants/BaseUrlConstants';

const API_URL: string = BaseUrlConstants.BASE_URL;
const POSITION_URL: string = API_URL + 'positions';

class PositionService extends ServiceBase {
    constructor() {
        super(POSITION_URL);
    }

}

export default new PositionService();
