import { Meetup } from "../../types";
import { db } from "../connect";
import {updateUser} from "../update/user";

async function createMeetup(meetup: Meetup) {
    const meetups = db.collection('meetups');
    await updateUser(meetup.creator, { update: { $push: { meetups: meetup._id } } });

    return await meetups.insertOne(meetup.toJSON());
}

export { createMeetup };