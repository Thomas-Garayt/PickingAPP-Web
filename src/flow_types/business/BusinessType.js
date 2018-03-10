declare interface Business extends Entity {
    reference: string,
    title: string,
    pole: {id: number, name: string},
    state: string,
    result: string,
    client: {id: number, name: string},
    clientfinal: {id: number, name: string},
    amountQuote: number,
    representative: {id: number, lastname: string, firstname: string},
}
