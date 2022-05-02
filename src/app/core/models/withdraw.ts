export class Withdraw{

    BankCode: string;
    Amount: number;
    Pin: string;

    constructor(){}

    setForm?(form : any){
        this.Amount = form.amount;
    }
}