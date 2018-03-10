// @flow

import EventEmitter from 'events';
import AppDispatcher from 'dispatchers/AppDispatcher';

/**
 * The Base Store from witch all stores must inherit.
 * It contains some utils methods to subscribe to actions and manage change events.
 */
export default class BaseStore extends EventEmitter {

    _dispatchToken: string;

    subscribe(actionSubscribe: () => (action: {type: string, payload: Object}) => void) {
        this._dispatchToken = AppDispatcher.register(actionSubscribe());
    }

    getDispatchToken(): string {
        return this._dispatchToken;
    }

    emitChange(): void {
        this.emit('CHANGE');
    }

    addChangeListener(callback: () => void) {
        this.on('CHANGE', callback)
    }

    removeChangeListener(callback: () => void) {
        this.removeListener('CHANGE', callback);
    }
}
