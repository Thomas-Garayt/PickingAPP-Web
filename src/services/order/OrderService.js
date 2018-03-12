// @flow

// $FlowIgnoreMe
import request from 'reqwest';
import when from 'when';

import OrderConstants from 'constants/Order/OrderConstants';

import TokenContainer from 'services/TokenContainer';

class OrderService {

    generateOrder(number: integer): Promise<*> {
        return this.handleOrder(when(request({
            url: OrderConstants.GENERATE_ORDER_URL + "/" + number,
            method: 'GET',
            crossOrigin: true,
            type: 'json',
            contentType: 'application/json',
            headers: { 'X-Auth-Token': TokenContainer.get() },
        })));
    }

    handleOrder(orderPromise: Promise<*>) {
        return orderPromise
            .then(function (response) {
                return true;
            });
    }
}

export default new OrderService()
