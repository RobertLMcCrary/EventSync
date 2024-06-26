"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuth = void 0;
var GoogleAuth = /** @class */ (function () {
    function GoogleAuth(_a) {
        var expires_in = _a.expires_in, refresh_token = _a.refresh_token, access_token = _a.access_token, scope = _a.scope, token_type = _a.token_type, id_token = _a.id_token, expiry_date = _a.expiry_date;
        this.expires_in = expires_in;
        this.refresh_token = refresh_token;
        this.access_token = access_token;
        this.scope = scope;
        this.token_type = token_type;
        this.expiry_date = expiry_date;
        this.id_token = id_token;
    }
    return GoogleAuth;
}());
exports.GoogleAuth = GoogleAuth;
