import {generateSnowflake} from "../db/utils/snowflake";
import {GoogleAuth} from "./GoogleAuth";

// TODO: Decide on the fields for a User

interface ReadNotification {
    notificationID: string;
    read: boolean;
}

interface UserParams {
    username: string;
    email: string;
    password: string;
    meetups?: string[];
    _id?: string;
    avatar?: string;
    notifications?: ReadNotification[];
    theme?: "light" | "dark" | "system";
    verified?: boolean;
    friends?: string[];
    googleAccount?: GoogleAuth | null;
    interests?: string[];
    outgoingFriendRequests?: string[];
    incomingFriendRequests?: string[];
    bio?: string;
    location?: string;
}

class User {
    _id: string; // MongoDB defines _id as the primary key
    username: string;
    email: string;
    password: string;
    meetups: string[]; // Array of meetup ids
    avatar: string; // URL to the user's avatar
    notifications: ReadNotification[]; // Array of notification ids
    theme: "light" | "dark" | "system" = "system"; // User's preferred theme
    verified: boolean; // Whether the user has verified their email
    friends: string[]; // Array of user ids
    googleAccount: GoogleAuth | null; // Google account information
    interests: string[]; // Array of interests
    outgoingFriendRequests: string[]; // Array of user ids
    incomingFriendRequests: string[];
    bio: string; // User's bio
    location: string; // User's location

    constructor({username, email, password, meetups, _id, avatar, notifications, theme, verified, friends, googleAccount, interests, bio, location, outgoingFriendRequests, incomingFriendRequests}: UserParams) {
        this._id = _id ? _id : generateSnowflake();
        this.username = username;
        this.email = email;
        this.password = password;
        this.meetups = meetups ? meetups : [];
        this.avatar = avatar ? avatar : "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-person-2220431045";
        this.notifications = notifications ? notifications : [];
        this.theme = theme? theme : "system";
        this.verified = verified ? verified : false;
        this.friends = friends ? friends : [];
        this.googleAccount = googleAccount ? googleAccount : null;
        this.interests = interests ? interests : [];
        this.outgoingFriendRequests = outgoingFriendRequests ? outgoingFriendRequests : [];
        this.incomingFriendRequests = incomingFriendRequests ? incomingFriendRequests : [];
        this.bio = bio ? bio : "";
        this.location = location ? location : "";
    }

    // Converts a User instance to a JSON object
    toJSON(): any {
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
            outgoingFriendRequests: this.outgoingFriendRequests,
            incomingFriendRequests: this.incomingFriendRequests,
            bio: this.bio,
            location: this.location,
        };
    }
}

const defaultUser = new User({
    username: "John Doe",
    email: "johndoe@eventsync.app",
    password: "password",
    avatar: "https://avatars.githubusercontent.com/u/76001641?v=4",
    bio: "Passionate about hiking and technology.",
    interests: ["Hiking", "Technology", "AI"],
});

export {User, defaultUser};
export type {ReadNotification};