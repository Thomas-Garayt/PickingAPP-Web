// @flow

import dispatcher from 'dispatchers/AppDispatcher';
import Promise from 'promise';
import ActionsBase from 'actions/ActionsBase';

import PositionConstants from 'constants/position/PositionConstants';
import PositionService from 'services/position/PositionService';

class PositionActions extends ActionsBase {

    create = (position: Position): Promise < * > => {
        const $this = this;
        return new Promise((resolve: (position: Position) => void, reject: (response: Object) => void): void => {
            PositionService.post(position)
                .then(handleSuccess).catch(handleError);

            function handleSuccess(newPosition: Position): void {
                dispatcher.dispatch({
                    type: PositionConstants.RECEIVE_POSITION,
                    payload: {
                        position: newPosition
                    }
                });
                resolve(newPosition);
            }

            function handleError(err: Object): void {
                $this.handleError(err, reject);
            }
        });
    }
    edit = (id: number, position: Object): Promise < * > => {
        const $this = this;
        return new Promise((resolve: (position: Position) => void, reject: (response: Object) => void): void => {
            PositionService.patch(id, position)
                .then(handleSuccess).catch(handleError);

            function handleSuccess(newPosition: Position): void {
                dispatcher.dispatch({
                    type: PositionConstants.RECEIVE_POSITION,
                    payload: {
                        position: newPosition
                    }
                });
                resolve(newPosition);
            }

            function handleError(err: Object): void {
                $this.handleError(err, reject);
            }
        });
    }
    delete = (id: number): Promise < * > => {
        const $this = this;
        return new Promise((resolve: () => void, reject: (response: Object) => void): void => {
            PositionService.remove(id)
                .then(handleSuccess).catch(handleError);

            function handleSuccess(): void {
                dispatcher.dispatch({
                    type: PositionConstants.DELETE_POSITION,
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
            PositionService.getAll()
                .then(handleSuccess).catch(handleError);

            function handleSuccess(positions: Array < Position > ): void {
                dispatcher.dispatch({
                    type: PositionConstants.RECEIVE_POSITIONS,
                    payload: {
                        positions: positions
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

export default new PositionActions();
