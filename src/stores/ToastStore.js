// @flow

import BaseStore from 'stores/BaseStore';
import ToastConstants from 'constants/ToastConstants';

class ToastStore extends BaseStore {

    toasts: Array<Toast>;

    constructor() {
        super();
        this.subscribe(() => this._registerToActions.bind(this));
        this.toasts = [];
    }

    _registerToActions(action: {type: string, payload: Object}): void {
        const {type, payload} = action;

        if(type === ToastConstants.CREATE_TOAST){
            this._createToast(payload.message, payload.description, payload.toastType);
        }
    }

    _createToast(message: string, description: string, type: ToastType): void {
        this.toasts.push({
            message,
            description,
            type
        });
        this.emitChange();
    }

    getAll(): Array<Toast> {
        var toasts = this.toasts;
        this.toasts = [];
        return toasts;
    }

}

export default new ToastStore();
