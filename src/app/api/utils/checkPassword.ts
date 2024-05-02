import * as bcrypt from 'bcryptjs';

export default async function checkPassword(password: string, hashedPassword: string): Promise<boolean> { //pass check func
    return await bcrypt.compare(password, hashedPassword);
}