import {generateSnowflake} from "../db/utils/snowflake";

export interface AnnouncementParams {
    content: string;
    creator: string;
    date?: Date;
    _id?: string;
}

export class Announcement {
    _id: string;
    content: string;
    creator: string;
    date: Date;

    constructor({content, creator, date, _id}: AnnouncementParams) {
        this._id = _id? _id : generateSnowflake();
        this.content = content
        this.creator = creator;
        this.date = date? date : new Date();
    }

    // Converts an Announcement instance to a JSON object
    toJSON() {
        return {
            _id: this._id,
            content: this.content,
            creator: this.creator,
            date: this.date
        };
    }
}