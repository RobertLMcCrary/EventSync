"use client";

import {sessionContext, useUser} from "@/app/providers";
import {useState, useEffect, useContext} from "react";
import {AppNotification, User, Meetup} from "@/types";
import NotificationCard from "@/app/components/notification";
import {useRouter} from "next13-progressbar";

export default function NotificationsPage() {
    const {user, updateUser} = useUser();
    const router = useRouter();
    const session = useContext(sessionContext);

    const [notifications, setNotifications] = useState<(AppNotification | null)[]>([null, null, null, null, null]);
    const [knownUsers, setKnownUsers] = useState<User[]>([]);
    const [knownMeetups, setKnownMeetups] = useState<Meetup[]>([]);

    useEffect(() => {
        if (!user) return;

        if (notifications.includes(null)) {
            setNotifications([]);
            const notificationPromises = Promise.all(user.notifications.map(async (notification) => {
                const res = await fetch(`/api/notification/${notification.notificationID}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.session.token}`
                    }
                });
                if (!res.ok) return null;
                const data = await res.json();

                if (!knownUsers.includes(data.initiator)) {
                    const res = await fetch(`/api/user/${data.initiator}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${session.session.token}`
                        },
                    });
                    if (!res.ok) return null;
                    const userData = await res.json();
                    setKnownUsers([...knownUsers, userData]);
                }
                if (data.meetup && !knownMeetups.includes(data.meetup)) {
                    const res = await fetch(`/api/meetup/${data.meetup}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${session.session.token}`
                        },
                    });
                    if (!res.ok) return null;
                    const meetupData = await res.json();
                    setKnownMeetups([...knownMeetups, meetupData]);
                }
                return data;
            }));

            notificationPromises.then((notificationsData) => {
                let notificationsDataFiltered = notificationsData.filter((notification) => notification !== null);
                setNotifications(notificationsDataFiltered.map((notification) => notification as AppNotification));
            });
        }
    }, [knownMeetups, knownUsers, notifications, session.session.token, user]);




    return (
        <div className="p-4 gap-4 w-full h-[calc(100vh-80px)] overflow-y-scroll auto-rows-max grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1">
            {notifications.sort().toReversed().map((notification, index) => (
                <div key={index} className="h-36">
                    <NotificationCard initiator={knownUsers.find((user) => user._id == notification?.initiator) || null} meetup={knownMeetups.find((meetup) => meetup._id == notification?.meetup) || null} onClick={notification?.buttonHREF ? () => router.push(notification.buttonHREF) : () => router.push('/dashboard')} notification={notification} key={index}/>
                </div>
            ))}
        </div>
    );
}