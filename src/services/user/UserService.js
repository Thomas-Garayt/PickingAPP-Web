// @flow

import ServiceBase from 'services/ServiceBase';
import BaseUrlConstants from 'constants/BaseUrlConstants';

const USERS_URL: string = `${BaseUrlConstants.BASE_URL}users`;

class UserService extends ServiceBase {
    constructor() {
        super(USERS_URL);
    }

    updatePassword(userId: number, passwords: Object): Promise<*> {
        return this.execute({
            url: `${USERS_URL}/${userId}/updatePassword`,
            method: 'PATCH',
            data: passwords,
        });
    }
}

export default new UserService();
