declare type ToastType = 'success' | 'info' | 'warning' | 'error';
declare interface  Toast {
    message: string,
    description: string,
    type: ToastType
};
