import { db } from '../connect';

// Updates a user in the database

async function updateUser(userID: string, update: any) : Promise<void> {
    const users = await db.collection('users');

    await users.updateOne({ _id: userID }, update['update'], update['options'] || {});
}

export { updateUser };
