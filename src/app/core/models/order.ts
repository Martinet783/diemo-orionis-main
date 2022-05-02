export class Order{
    amount: number;
    created_at: number;
    created_by_pos: string;
    documento: string;
    phone: string;
    reference: string;
    status: number;
    traceNumber: string;
    type ?: string;
    user_name ?: string;
    currency ?: string;
}