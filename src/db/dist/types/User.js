"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultUser = exports.User = void 0;
var snowflake_1 = require("../db/utils/snowflake");
var User = /** @class */ (function () {
    function User(_a) {
        var username = _a.username, email = _a.email, password = _a.password, meetups = _a.meetups, _id = _a._id, avatar = _a.avatar, notifications = _a.notifications, theme = _a.theme, verified = _a.verified, friends = _a.friends, googleAccount = _a.googleAccount, interests = _a.interests, bio = _a.bio, location = _a.location;
        this.theme = "system"; // User's preferred theme
        this._id = _id ? _id : (0, snowflake_1.generateSnowflake)();
        this.username = username;
        this.email = email;
        this.password = password;
        this.meetups = meetups ? meetups : [];
        this.avatar = avatar ? avatar : "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-person-2220431045";
        this.notifications = notifications ? notifications : [];
        this.theme = theme ? theme : "system";
        this.verified = verified ? verified : false;
        this.friends = friends ? friends : [];
        this.googleAccount = googleAccount ? googleAccount : null;
        this.interests = interests ? interests : [];
        this.bio = bio ? bio : "";
        this.location = location ? location : "";
    }
    // Converts a User instance to a JSON object
    User.prototype.toJSON = function () {
        return {
            _id: this._id,
            username: this.username,
            email: this.email,
            password: this.password,
            meetups: this.meetups,
            avatar: this.avatar,
            notifications: this.notifications,
            theme: this.theme,
            verified: this.verified,
            friends: this.friends,
            googleAccount: this.googleAccount,
            interests: this.interests,
            bio: this.bio,
            location: this.location,
        };
    };
    return User;
}());
exports.User = User;
var defaultUser = new User({
    username: "John Doe",
    email: "johndoe@eventsync.app",
    password: "password",
});
exports.defaultUser = defaultUser;
