import { db } from '../connect';

// Updates a user in the database

async function updateNotification(notificationID: string, update: any) : Promise<void> {
    const users = await db.collection('notifications');
    await users.updateOne({ _id: notificationID }, update);
}

export { updateNotification };
