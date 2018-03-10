// @flow

import BaseStore from 'stores/BaseStore';

/**
 * A base store to manage entities (basically classes with an ID).
 * It contains all the basic actions (e.g. Receive one entity, Receive all entities, Delete an entity, etc.)
 */
export default class EntityStoreBase<T: Entity> extends BaseStore {

    _entities: Array<T>;

    constructor() {
        super();
        this._entities = [];
    }

    _receiveEntity = (entity: T): void => {
        var i = this._entities.findIndex((f) => f.id === entity.id );
        if (i > -1) {
            this._entities[i] = entity;
        } else {
            this._entities.push(entity);
        }
        this.emitChange();
    }

    _receiveAllEntities = (entities: Array<T>): void => {
        this._entities = entities;
        this.emitChange();
    }

    _receiveSomeEntities = (entities: Array<T>): void => {
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            const index = this._entities.findIndex(e => e && e.id === entity.id);
            if (index > -1) {
                this._entities[index] = entity;
            } else {
                this._entities.push(entity);
            }
        }
        this.emitChange();
    };

    _deleteEntity = (id: number): void => {
        var i = this._entities.findIndex( (e) => e.id === id );
        if (i > -1) {
            this._entities.splice(i, 1);
            this.emitChange();
        }
    }


}
