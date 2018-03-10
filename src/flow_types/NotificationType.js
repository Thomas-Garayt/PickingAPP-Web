declare interface Notification {
    id: number,
    title: string,
    content: string,

    type: string,
    resourceId: number,
    extra: Object
}
