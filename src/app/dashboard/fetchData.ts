import {Meetup, User, AppNotification} from '@/types';
import {getUpcomingEvents} from "@/app/api/utils/eventFinder";

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
}

export default function fetchData({session, setKnownUsers, user, setNotifications, knownUsers, setMeetups, meetups, notifications, router, status, knownMeetups, setKnownMeetups} : fetchParams){
    if (!user) return;
    if (!knownUsers.includes(user)) setKnownUsers((prev: any) => [...prev, user]);

    if (status == 'error') {
        router.push('/login?redirect=/dashboard');
        return;
    }
    if (status != 'done') return;




    if (user.meetups && meetups.includes(null)) {
        setMeetups([]);
        user.meetups.forEach((meetupID: string) => {
            fetch(`/api/meetup/${meetupID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.token}`
                }
            }).then((res) => {
                res.json().then((meetup) => {
                    if ('error' in meetup) {
                        router.push('/login?redirect=/dashboard');
                        return;
                    }
                    setMeetups((prev: any) => [...prev, meetup]);
                    setKnownMeetups((prev: any) => [...prev, meetup]);
                    if (knownUsers.find((user: User) => user._id == meetup.creator)) {
                        return;
                    }
                    fetch(`/api/user/${meetup.creator}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${session.token}`
                        }
                    }).then((res) => {
                        res.json().then((creator) => {
                            setKnownUsers((prev: any) => [...prev, creator]);
                        });
                    });
                });
            });
        });
    }

    if (user.notifications && notifications.includes(null)) {
        setNotifications([]);
        user.notifications.forEach((notificationID: string) => {
            fetch(`/api/notification/${notificationID}`, {
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