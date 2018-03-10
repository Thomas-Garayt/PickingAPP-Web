// @flow

import dispatcher from 'dispatchers/AppDispatcher';
import Promise from 'promise';
import ActionsBase from 'actions/ActionsBase';

import PreparationConstants from 'constants/preparation/PreparationConstants';
import PreparationService from 'services/preparation/PreparationService';

class PreparationActions extends ActionsBase {

    create = (preparation: Preparation): Promise < * > => {
        const $this = this;
        return new Promise((resolve: (preparation: Preparation) => void, reject: (response: Object) => void): void => {
            PreparationService.post(preparation)
                .then(handleSuccess).catch(handleError);

            function handleSuccess(newPreparation: Preparation): void {
                dispatcher.dispatch({
                    type: PreparationConstants.RECEIVE_PREPARATION,
                    payload: {
                        preparation: newPreparation
                    }
                });
                resolve(newPreparation);
            }

            function handleError(err: Object): void {
                $this.handleError(err, reject);
            }
        });
    }
    edit = (id: number, preparation: Object): Promise < * > => {
        const $this = this;
        return new Promise((resolve: (preparation: Preparation) => void, reject: (response: Object) => void): void => {
            PreparationService.patch(id, preparation)
                .then(handleSuccess).catch(handleError);

            function handleSuccess(newPreparation: Preparation): void {
                dispatcher.dispatch({
                    type: PreparationConstants.RECEIVE_PREPARATION,
                    payload: {
                        preparation: newPreparation
                    }
                });
                resolve(newPreparation);
            }

            function handleError(err: Object): void {
                $this.handleError(err, reject);
            }
        });
    }
    delete = (id: number): Promise < * > => {
        const $this = this;
        return new Promise((resolve: () => void, reject: (response: Object) => void): void => {
            PreparationService.remove(id)
                .then(handleSuccess).catch(handleError);

            function handleSuccess(): void {
                dispatcher.dispatch({
                    type: PreparationConstants.DELETE_PREPARATION,
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
            PreparationService.getAll()
                .then(handleSuccess).catch(handleError);

            function handleSuccess(preparations: Array < Preparation > ): void {
                dispatcher.dispatch({
                    type: PreparationConstants.RECEIVE_PREPARATIONS,
                    payload: {
                        preparations: preparations
                    }
                });
                resolve();
            }

            function handleError(err: Object): void {
                $this.handleError(err, reject);
            }
        });
    }

    reloadNotFinished = (): Promise<*> => {
        const $this = this;
        return new Promise((resolve: () => void, reject: (response: Object) => void): void => {
            function handleSuccess(preparations: Array<Preparation>): void {
                dispatcher.dispatch({
                    type: PreparationConstants.RECEIVE_NOT_FINISHED_PREPARATIONS,
                    payload: {
                        preparations,
                    },
                });
                resolve();
            }

            function handleError(err: Object): void {
                $this.handleError(err, reject);
            }

            PreparationService.getNotFinished().then(handleSuccess).catch(handleError);
        });
    };

}

export default new PreparationActions();
