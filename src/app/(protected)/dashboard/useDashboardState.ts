import {useContext, useState} from "react";
import {sessionContext, useUser, expiredContext, globalErrorContext} from "@/app/providers";
import {AppNotification, Meetup, User} from "@/types";
import {useRouter} from "next13-progressbar";

export default function useDashboardState() {
    const {user, updateUser} = useUser();
    const [meetups, setMeetups] = useState<(Meetup | null)[]>([null, null, null, null]);
    const [knownUsers, setKnownUsers] = useState<User[]>([]);
    const [notifications, setNotifications] = useState<(AppNotification | null)[]>([null, null, null, null]);
    const [knownMeetups, setKnownMeetups] = useState<Meetup[]>([]);
    const router = useRouter();
    const { setGlobalError } = useContext(globalErrorContext);
    // Get TOKEN from cookie
    const { session, status } = useContext(sessionContext);
    const {expired, setExpired} = useContext(expiredContext);

    return {
        user,
        meetups,
        setMeetups,
        knownUsers,
        setKnownUsers,
        notifications,
        setNotifications,
        router,
        session,
        status,
        knownMeetups,
        setKnownMeetups,
        updateUser,
        expired,
        setExpired,
        setGlobalError
    };

}