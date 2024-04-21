
interface GoogleAuthParams {
    expires_in: number;
    refresh_token: string;
    access_token: string;
    scope: string;
    token_type: string;
    id_token: string;
    expiry_date: number;

}

class GoogleAuth {
    expires_in: number;
    refresh_token: string;
    access_token: string;
    scope: string;
    token_type: string;
    id_token: string;
    expiry_date: number;


    constructor({expires_in, refresh_token, access_token, scope, token_type, id_token, expiry_date}: GoogleAuthParams) {
        this.expires_in = expires_in;
        this.refresh_token = refresh_token;
        this.access_token = access_token;
        this.scope = scope;
        this.token_type = token_type;
        this.expiry_date = expiry_date;
        this.id_token = id_token;
    }

    toJSON() {
        return {
            expires_in: this.expires_in,
            refresh_token: this.refresh_token,
            access_token: this.access_token,
            scope: this.scope,
            token_type: this.token_type,
            id_token: this.id_token,
            expiry_date: this.expiry_date,
        }
    }
}

export { GoogleAuth }
