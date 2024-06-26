import {User} from "@/types";

export default function formatAttendeesString(meetupAttendees: User[], user: User | null) {
    let attendeesShow = null;
    let attendeeAvatars: (string | undefined)[] = [];
    if (!user) return attendeesShow;

    if (meetupAttendees.length > 0) {
        if (meetupAttendees.length === 1) {
            if (meetupAttendees[0]._id == user._id) {
                attendeesShow = "You are";
                attendeeAvatars.push(user.avatar);
            } else {
                attendeesShow = `${meetupAttendees[0].username} is`;
                attendeeAvatars.push(meetupAttendees[0].avatar);
            }
        } else {
            if (meetupAttendees.find((attendee) => attendee._id == user._id)) {
                if (meetupAttendees[0]._id == user._id) {
                    attendeesShow = `${meetupAttendees[1].username}`;
                    attendeeAvatars.push(meetupAttendees[1].avatar);
                } else {
                    attendeesShow = `${meetupAttendees[0].username}`;
                    attendeeAvatars.push(meetupAttendees[0].avatar);
                }

                if (meetupAttendees.length > 3) {
                    attendeesShow += ` and ${meetupAttendees.length - 2} others are`;
                    let availableAvatars = meetupAttendees.filter((attendee) => attendee._id != user._id && !attendeeAvatars.includes(attendee.avatar))
                    for (let index = 0; index < availableAvatars.length; index++) {
                        attendeeAvatars.push(availableAvatars[index].avatar);
                    }
                } else {
                    if (meetupAttendees.length == 3) {
                        attendeesShow += ` and 1 other is`;
                        attendeeAvatars.push(meetupAttendees.find((attendee) => attendee._id != user._id && !attendeeAvatars.includes(attendee.avatar))?.avatar);
                    } else {
                        attendeesShow += ` and you are`;
                        attendeeAvatars.push(user.avatar);
                    }

                }
            } else {
                if (meetupAttendees.length > 2) {
                    attendeesShow = `${meetupAttendees[0].username} and ${meetupAttendees.length - 1} others are`;
                    for (let index = 0; index < meetupAttendees.length; index++) {
                        attendeeAvatars.push(meetupAttendees[index].avatar);
                    }
                } else {
                    attendeesShow = `${meetupAttendees[0].username} and 1 other is`;
                    attendeeAvatars.push(meetupAttendees[0].avatar);
                    attendeeAvatars.push(meetupAttendees[1].avatar);
                }
            }
        }
    } else {
        attendeesShow = "No one is";
    }



    return {attendeesShow, attendeeAvatars};
}