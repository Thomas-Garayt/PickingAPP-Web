// @flow

import EntityStoreBase from 'stores/EntityStoreBase';
import PositionConstants from 'constants/position/PositionConstants';

class PositionStore extends EntityStoreBase {

    constructor() {
        super();
        this.subscribe(() => this._registerToActions);
    }

    _registerToActions = (action: {type: string, payload: Object}): void => {
        const {type, payload} = action;
        switch (type) {
            case PositionConstants.RECEIVE_POSITIONS:
                this._receiveAllEntities(payload.positions);
                break;
            case PositionConstants.RECEIVE_POSITION:
                this._receiveEntity(payload.position);
                break;
            case PositionConstants.DELETE_POSITION:
                this._deleteEntity(payload.id);
                break;
            default:
                // Do Nothing
                break;
        }
    }

    ///// Public Methods  /////

    /**
     * Get all the positiones.
     */
    getAll = (): Array<Position> => {
        return this._entities;
    }

    /**
     * Get a position by ID.
     * @param  {number} id The identifier of the position.
     * @return {?Position}   The position, or NULL if no position is found.
     */
    getById = (id: number): ?Position => {
        return this._entities.find( (e) => e.id === id );
    }

}

export default new PositionStore();
