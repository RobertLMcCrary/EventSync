import { AppNotification } from '../../types';
import { db } from '../connect';
import {updateUser} from "../update/user";
import {getMeetup} from "../read/meetup";

async function createNotification(notification: AppNotification) {
    const notifications = db.collection('notifications');

    switch (notification.type) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
            await updateUser(notification.receiver, {update: {"$push": {"notifications": {"notificationID": notification._id, "read": false}}}});
            break;
        case 7:
        case 8:
        case 9:
        case 10:
            const meetup = await getMeetup(notification.meetup);
            if (!meetup) throw new Error("Meetup not found");
            meetup.attendees.forEach((attendee: string) => {
                if (attendee == meetup.creator) return;
                updateUser(attendee, {update: {"$push": {"notifications": {"notificationID": notification._id, "read": false}}}});
            });
            break;
        case 11:
        case 12:
        case 13:
            const meetup2 = await getMeetup(notification.meetup);
            if (!meetup2) throw new Error("Meetup not found");
            meetup2.attendees.forEach((attendee: string) => {
                updateUser(attendee, {update: {"$push": {"notifications": {"notificationID": notification._id, "read": false}}}});
            });
            break;
        default:
            break;
    }

    return await notifications.insertOne(notification.toJSON());
}

export { createNotification };