// @flow

import EntityStoreBase from 'stores/EntityStoreBase';
import BusinessConstants from 'constants/business/BusinessConstants';

class BusinessStore extends EntityStoreBase {

    nextReference: string;

    constructor() {
        super();
        this.subscribe(() => this._registerToActions);
        this.nextReference = '';
    }

    _registerToActions = (action: {type: string, payload: Object}): void => {
        const {type, payload} = action;
        switch (type) {
            case BusinessConstants.RECEIVE_BUSINESSES:
                this._receiveAllEntities(payload.businesses);
                break;
            case BusinessConstants.RECEIVE_BUSINESS:
                this._receiveEntity(payload.business);
                break;
            case BusinessConstants.DELETE_BUSINESS:
                this._deleteEntity(payload.id);
                break;

            case BusinessConstants.RECEIVE_BUSINESS_NEXT_REFERENCE:
                this._receiveNextReference(payload.nextReference);
                break;

            default:
                // Do Nothing
                break;
        }
    }

    _receiveNextReference(nextReference: string): void {
        this.nextReference = nextReference;
        this.emitChange();
    }

    ///// Public Methods  /////

    /**
     * Get all the businesses.
     */
    getAll = (): Array<Business> => {
        return this._entities;
    }

    /**
     * Get a business by ID.
     * @param  {number} id The identifier of the business.
     * @return {?Business}   The business, or NULL if no business is found.
     */
    getById = (id: number): ?Business => {
        return this._entities.find( (e) => e.id === id );
    }

    getNextReference(): string{
        return this.nextReference;
    }

}

export default new BusinessStore();
