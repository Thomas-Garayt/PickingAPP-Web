declare interface IPaymentTerm extends Entity {
    business: Entity,
    realfcdate: string,
    initialfcdate: string,
    realreceiptdate: string,
    atiprice: number,
    etprice: number,
    state: string,
}
