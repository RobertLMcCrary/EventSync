import {User} from "@/types";

export default function formatMemberString(meetupInvited: User[]) {
    let invitedShow = null;
    let invitedAvatars: (string | undefined)[] = [];

    if (meetupInvited.length > 0) {
        if (meetupInvited.length === 1) {
            invitedShow = `${meetupInvited[0].username} is`;
            invitedAvatars.push(meetupInvited[0].avatar);
        } else {
            invitedShow = `${meetupInvited[0].username} and ${meetupInvited.length - 1} others are`;
            for (let index = 0; index < meetupInvited.length; index++) {
                if (index > 2) break;
                invitedAvatars.push(meetupInvited[index].avatar);
            }
        }
    } else {
        invitedShow = "No one is";
    }



    return {invitedShow, invitedAvatars};
}