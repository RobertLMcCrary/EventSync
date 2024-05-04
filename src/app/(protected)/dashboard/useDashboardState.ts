import {useContext, useState} from "react";
import {sessionContext, userContext, expiredContext} from "@/app/providers";
import {AppNotification, Meetup, User} from "@/types";
import {useRouter} from "next13-progressbar";

export default function useDashboardState() {
    const {user, updateUser} = useContext(userContext);
    const [meetups, setMeetups] = useState<(Meetup | null)[]>([null, null, null, null]);
    const [search, setSearch] = useState('');
    const [knownUsers, setKnownUsers] = useState<User[]>([]);
    const [notifications, setNotifications] = useState<(AppNotification | null)[]>([null, null, null, null]);
    const [knownMeetups, setKnownMeetups] = useState<Meetup[]>([]);
    const router = useRouter();
    // Get TOKEN from cookie
    const { session, status } = useContext(sessionContext);
    const {expired, setExpired} = useContext(expiredContext);

    return {
        user,
        meetups,
        setMeetups,
        search,
        setSearch,
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
        setExpired
    };

}