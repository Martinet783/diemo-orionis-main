export class User{
    user : string;
    password : string;
    device_token : string;
    repeat_password ?: string;
    emailID ?: string;
    emailID_match ?: string;
    alias ?: string;
    cedula ?: any;
    documento ?: any;
    operator ?: string;
    subPhoneNo ?: any;
    phoneNo ?: any;
    subName ?: string;
    pin ?: string;
    invitationCode ?: string;
    idDocumentType ?: any;
    birthdate ?: string;
    idGender ?: any;
    gender ?: any;
    firstName ?: string;
    lastName ?: string;
    last_login ?: number;
    token ?: string;
    refresh ?: string;
    imei ?: number;
    arn ?: string;
    device ?: string;
    finger_key ?: string;
    sign : string;
    device_id:string;

    constructor(){}

    getPhone(){
        return this.subPhoneNo.slice(5, 12);
    }

    getPrefijo(){
        return this.subPhoneNo.slice(2, 5);
    }
}

