import {generateSnowflake} from "../db/utils/snowflake";

interface AnnouncementParams {
    title: string;
    description: string;
    creator: string;
    date?: Date;
    _id?: string;
}

export class Announcement {
    _id: string;
    title: string;
    description: string;
    creator: string;
    date: Date;

    constructor({title, description, creator, date, _id}: AnnouncementParams) {
        this._id = _id? _id : generateSnowflake();
        this.title = title;
        this.description = description;
        this.creator = creator;
        this.date = date? date : new Date();
    }

    // Converts an Announcement instance to a JSON object
    toJSON(): any {
        return {
            _id: this._id,
            title: this.title,
            description: this.description,
            creator: this.creator,
            date: this.date
        };
    }
}