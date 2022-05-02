export class Recharge {

    PhoneNumber : string;
    Amount: number;
    Reference: string;
    Date: string;
    BankCode: string;
    DocumentType : string;
    Document : string;
    ValidationType: number;

    setForm?(form: any){
        this.Amount = form.amount;
        this.Reference = String(form.referenceNumber);
        this.BankCode = form.bankCode
    }

}