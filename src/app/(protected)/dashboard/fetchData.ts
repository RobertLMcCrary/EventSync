import {Meetup, User, AppNotification, ReadNotification} from '@/types';

interface fetchParams {
    session: any;
    setKnownUsers: any;
    user: any;
    setNotifications: any;
    knownUsers: any;
    setMeetups: any;
    meetups: (Meetup | null)[],
    notifications: (AppNotification | null)[],
    router: any;
    status: string;
    knownMeetups: (Meetup)[];
    setKnownMeetups: any;
    setExpired: any;
}

export default function fetchData({session, setKnownUsers, user, setNotifications, knownUsers, setMeetups, meetups, notifications, router, status, knownMeetups, setKnownMeetups, setExpired} : fetchParams){
    if (!user) return;
    if (!knownUsers.includes(user)) setKnownUsers((prev: any) => [...prev, user]);

    if (status != 'done') return;

    if (user.meetups && (meetups.includes(null) || meetups.length != user.meetups.length)) {

        const fetchPromises = user.meetups.map(async (meetupID: string) => {
            const res = await fetch(`/api/meetup/${meetupID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.token}`
                }
            });
            return await res.json();
        });

        Promise.all(fetchPromises).then((meetupsData) => {
            const validMeetups = meetupsData.filter(meetup => !('error' in meetup) && new Date().getTime() - new Date(meetup.date.toLocaleString()).getTime() <= 0);
            setMeetups(validMeetups);
            setKnownMeetups((prev: any) => [...prev, ...validMeetups]);

            validMeetups.forEach((meetup) => {
                if (!knownUsers.find((user: User) => user._id == meetup.creator)) {
                    fetch(`/api/user/${meetup.creator}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${session.token}`
                        }
                    }).then((res) => {
                        res.json().then((creator) => {
                            if (!("error" in creator)) {
                                setKnownUsers((prev: any) => [...prev, creator]);
                            }
                        });
                    });
                }
            });
        }).catch((error) => {
            console.error("Error fetching meetups: ", error);
        });
    }


    if (user.notifications && notifications.includes(null)) {
        setNotifications([]);
        user.notifications.forEach((notificationObj: ReadNotification) => {
            if (notificationObj.read) return;
            fetch(`/api/notification/${notificationObj.notificationID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.token}`
                }
            }).then((res) => {
                res.json().then((notification) => {

                    setNotifications((prev: any) => [...prev, notification]);
                    if (notification.initiator) {
                        if (knownUsers.find((user: User) => user._id == notification.initiator)) {
                            return;
                        }
                        fetch(`/api/user/${notification.initiator}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${session.token}`
                            }
                        }).then((res) => {
                            res.json().then((initiator) => {
                                if ("error" in initiator) {
                                    setExpired(true);
                                    return;
                                }
                                setKnownUsers((prev: any) => [...prev, initiator]);
                            });
                        });
                    }
                    if (notification.meetup){
                        if (knownMeetups.find((meetup: Meetup) => meetup._id == notification.meetup)) {
                            return;
                        }
                        fetch(`/api/meetup/${notification.meetup}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${session.token}`
                            }
                        }).then((res) => {
                            res.json().then((meetup) => {
                                setKnownMeetups((prev: any) => [...prev, meetup]);
                            });
                        });
                    }
                });
            });
        });
    }


}