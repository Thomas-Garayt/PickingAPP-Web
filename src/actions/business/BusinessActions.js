// @flow

import dispatcher from 'dispatchers/AppDispatcher';
import Promise from 'promise';
import ActionsBase from 'actions/ActionsBase';

import BusinessConstants from 'constants/business/BusinessConstants';
import BusinessService from 'services/business/BusinessService';

class BusinessActions extends ActionsBase {

    create = (business: Business): Promise < * > => {
        const $this = this;
        return new Promise((resolve: (business: Business) => void, reject: (response: Object) => void): void => {
            BusinessService.post(business)
                .then(handleSuccess).catch(handleError);

            function handleSuccess(newBusiness: Business): void {
                dispatcher.dispatch({
                    type: BusinessConstants.RECEIVE_BUSINESS,
                    payload: {
                        business: newBusiness
                    }
                });
                resolve(newBusiness);
            }

            function handleError(err: Object): void {
                $this.handleError(err, reject);
            }
        });
    }
    edit = (id: number, business: Object): Promise < * > => {
        const $this = this;
        return new Promise((resolve: (business: Business) => void, reject: (response: Object) => void): void => {
            BusinessService.patch(id, business)
                .then(handleSuccess).catch(handleError);

            function handleSuccess(newBusiness: Business): void {
                dispatcher.dispatch({
                    type: BusinessConstants.RECEIVE_BUSINESS,
                    payload: {
                        business: newBusiness
                    }
                });
                resolve(newBusiness);
            }

            function handleError(err: Object): void {
                $this.handleError(err, reject);
            }
        });
    }
    delete = (id: number): Promise < * > => {
        const $this = this;
        return new Promise((resolve: () => void, reject: (response: Object) => void): void => {
            BusinessService.remove(id)
                .then(handleSuccess).catch(handleError);

            function handleSuccess(): void {
                dispatcher.dispatch({
                    type: BusinessConstants.DELETE_BUSINESS,
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
            BusinessService.getAll()
                .then(handleSuccess).catch(handleError);

            function handleSuccess(businesses: Array < Business > ): void {
                dispatcher.dispatch({
                    type: BusinessConstants.RECEIVE_BUSINESSES,
                    payload: {
                        businesses: businesses
                    }
                });
                resolve();
            }

            function handleError(err: Object): void {
                $this.handleError(err, reject);
            }
        });
    }

    loadNextReference = (): Promise < * > => {
        const $this = this;
        return new Promise((resolve: () => void, reject: (response: Object) => void): void => {
            BusinessService.getNextReference()
                .then(handleSuccess).catch(handleError);

            function handleSuccess(nextReference: string): void {
                dispatcher.dispatch({
                    type: BusinessConstants.RECEIVE_BUSINESS_NEXT_REFERENCE,
                    payload: {
                        nextReference: nextReference
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

export default new BusinessActions();
