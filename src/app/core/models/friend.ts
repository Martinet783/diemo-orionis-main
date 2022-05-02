export class Friend{
    created_at: number;
    documento: string;
    friend_alias: string;
    friend_number: string;
    type: string;
    bankCode ?: string;
    docType ?: string;

    getPhone(){
        return this.friend_number.slice(5, 12);
    }

    getPrefijo(){
        return this.friend_number.slice(2, 5);
    }
    constructor(friend : Friend){
        this.created_at = friend.created_at;
        this.documento = friend.documento;
        this.friend_alias = friend.friend_alias;
        this.friend_number = friend.friend_number;
        this.type = friend.type;

        if(friend.bankCode && friend.docType){
            this.bankCode = friend.bankCode;
            this.docType = friend.docType;
        }
    }
}