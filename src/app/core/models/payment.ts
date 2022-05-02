export class Payment{
    phone: string;
    amount: number;
    documento: string;
    reference: string;
    traceNumber: string;
    created_by_pos: string;
    type : string;
    created_at ?: number;
    operationType ?: number;
    expires_at ?: number;
    status: number;
    paymentConfirmation: boolean;
    user_name : string;
    currency : string;
}