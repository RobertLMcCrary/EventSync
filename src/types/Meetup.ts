import {generateSnowflake} from "../db/utils/snowflake";
import {Announcement, AnnouncementParams} from "./Announcement";
import {defaultUser} from "./User";

// TODO: Decide on the fields for a Meetup
interface MeetupParams {
    title: string;
    creator: string;
    description: string;
    date?: Date;
    location: string;
    attendees?: string[];
    _id?: string;
    image?: string;
    invited?: string[];
    unavailable?: string[];
    announcements?: (Announcement | Record<string, any>)[];
}

class Meetup {
    _id: string; // MongoDB defines _id as the primary key
    title: string;
    creator: string; // User id
    description: string;
    date: Date;
    image: string; // URL
    location: string; // Address
    attendees: string[]; // Array of user ids that are attending
    invited: string[]; // Array of user ids that have been invited
    unavailable: string[]; // Array of user ids that are not available but have been invited
    announcements: (Announcement | Record<string, any>)[];

    constructor({title, creator, description, date, location, attendees, _id, image, invited, unavailable, announcements}: MeetupParams) {
        this._id = _id? _id : generateSnowflake();
        this.title = title;
        this.description = description;
        this.date = date? date : new Date();
        this.location = location;
        this.creator = creator;
        this.attendees = attendees ? attendees : [];
        this.image = image ? image : "https://via.placeholder.com/150";
        this.invited = invited ? invited : [];
        this.unavailable = unavailable? unavailable : [];

        if (announcements) {
            this.announcements = announcements.map(announcement => {
                if (announcement instanceof Announcement) {
                    return announcement;
                } else {
                    return new Announcement(announcement as AnnouncementParams);
                }
            });
        } else {
            this.announcements = [];
        }

    }

    // Converts a Meetup instance to a JSON object
    toJSON(): any {
        console.log(this.announcements);
        return {
            _id: this._id,
            title: this.title,
            creator: this.creator,
            description: this.description,
            date: this.date,
            location: this.location,
            attendees: this.attendees,
            invited: this.invited,
            image: this.image,
            unavailable: this.unavailable,
            announcements: this.announcements.map(announcement => announcement.toJSON())
        };
    }
}

const defaultMeetup = new Meetup({
    title: "Excursion in the Alps",
    description: "We will be hiking in the Alps.",
    date: new Date("2022-12-12T12:00:00Z"),
    creator: defaultUser._id,
    attendees: [defaultUser._id],
    location: "Alps, Switzerland",
    image: "https://d3mvlb3hz2g78.cloudfront.net/wp-content/uploads/2017/04/thumb_720_450_Alpsdreamstime_xl_45054687.jpg"
});

export {Meetup, defaultMeetup};