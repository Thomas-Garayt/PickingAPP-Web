declare interface IProviderBill extends Entity {
    company: Entity,
    business: Entity,
    billdate: string,
    receiptdate: string,
    disbursementdate: string,
    state: string,
    amount: number
}
