// @flow

import dispatcher from 'dispatchers/AppDispatcher';
import ToastConstants from 'constants/ToastConstants';

class ToastActions {
    createToast(message: string, description: string, toastType: ToastType): void {
        dispatcher.dispatch({
            type: ToastConstants.CREATE_TOAST,
            payload: {
                message,
                description,
                toastType
            }
        });
    }

    createToastError(message: string, description: string): void {
        this.createToast(message, description, 'error');
    }
}

export default new ToastActions();
