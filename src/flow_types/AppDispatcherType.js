
/**
 * The type declaration of the AppDispatcher.
 */
declare interface AppDispatcher {
    dispatch: (action: {type: string, payload: Object})=>void,
    register: (actionSubscriber: (action: {type: string, payload: Object})=>void)=>string
}
