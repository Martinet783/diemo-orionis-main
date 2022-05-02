export class Transactions{
    amount: number;
    bankReference ?: string;
    balance_after ?: number;
    balance_before ?: number;
    documento ?: string;
    cedula ?: string;
    phone ?: string;
    created_at: number;
    currency: string;
    commission ?: any;
    debe: number;
    destiny: string;
    operationType: number;
    origin: string;
    status: number;
    traceNumber: string;
    type: string;
    destinyName : string;
    originName : string;
    idBoxTransactionType ?: any;
}