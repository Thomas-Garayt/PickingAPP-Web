// @flow

import EntityStoreBase from 'stores/EntityStoreBase';
import PreparationConstants from 'constants/preparation/PreparationConstants';

class PreparationStore extends EntityStoreBase {

    constructor() {
        super();
        this.subscribe(() => this._registerToActions);
    }

    _registerToActions = (action: {type: string, payload: Object}): void => {
        const {type, payload} = action;
        switch (type) {
            case PreparationConstants.RECEIVE_PREPARATIONS:
                this._receiveAllEntities(payload.preparations);
                break;
            case PreparationConstants.RECEIVE_PREPARATION:
                this._receiveEntity(payload.preparation);
                break;
            case PreparationConstants.DELETE_PREPARATION:
                this._deleteEntity(payload.id);
                break;
            case PreparationConstants.RECEIVE_NOT_FINISHED_PREPARATION:
                this._receiveNotFinished(payload.preparations);
                break;
            default:
                // Do Nothing
                break;
        }
    }

    ///// Public Methods  /////
    _receiveNotFinished(preparations: Array<Preparation>): void {
        this._entities = this._entities.concat(preparations);
        this.emitChange();
    }

    /**
     * Get all the preparations.
     */
    getAll = (): Array<Preparation> => {
        return this._entities;
    }

    /**
     * Get a preparation by ID.
     * @param  {number} id The identifier of the preparation.
     * @return {?Preparation}   The preparation, or NULL if no preparation is found.
     */
    getById = (id: number): ?Preparation => {
        return this._entities.find((p) => p.id === id );
    }

    getNotFinished = (): Array<Preparation> => {
        return this._entities.filter((p) => p.endTime == null);
    }

}

export default new PreparationStore();
