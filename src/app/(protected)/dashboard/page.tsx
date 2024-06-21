"use client";
import MeetupCard from "@/app/components/meetupCard";
import {useEffect, useState} from "react";
import {Input, Button, Link} from "@nextui-org/react";
import {MagnifyingGlassIcon, PlusIcon} from "@heroicons/react/24/solid";
import NotificationCard from "@/app/components/notification";
import useDashboardState from "@/app/(protected)/dashboard/useDashboardState";
import fetchData from './fetchData';


export default function Dashboard() {
    const { user, meetups, setMeetups, knownUsers, setKnownUsers, notifications, setNotifications, router, session, status, knownMeetups, setKnownMeetups, updateUser, expired, setExpired, setGlobalError} = useDashboardState();
    const [visibleMeetups, setVisibleMeetups] = useState(meetups);
    const [meetupsSearch, setMeetupsSearch] = useState("");

    useEffect(() => {
        fetchData({
            session,
            setKnownUsers,
            user,
            setNotifications,
            knownUsers,
            setMeetups,
            meetups,
            notifications,
            router,
            status,
            knownMeetups,
            setKnownMeetups,
            setExpired,
            setGlobalError,
            setVisibleMeetups
        });
    }, [meetups, notifications, session, knownUsers, router, status, user, setKnownUsers, setNotifications, setMeetups, knownMeetups, setKnownMeetups, setExpired, setGlobalError]);

    function viewNotification(notificationID: string){
        if (!user) return;

        fetch('/api/user/'+user._id, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session.token
            },
            body: JSON.stringify({
                update: {
                    $set: {
                        "notifications.$[elem].read": true
                    }
                },
                options: {
                    arrayFilters: [
                        {"elem.notificationID": notificationID}
                    ]
                }
            })
        });
        updateUser().then(() => {
            const notificationObj = notifications.find((notification) => notification?._id == notificationID);
            if (notificationObj?.buttonHREF) router.push(notificationObj.buttonHREF);
            else router.push('/notifications');
        }
    )

    }

    useEffect(() => {
        if (meetupsSearch.length == 0) {
            setVisibleMeetups(meetups);
            return;
        } else {
            setVisibleMeetups(meetups.filter((meetup) => meetup?.title.toLowerCase().includes(meetupsSearch.toLowerCase())));
        }
    }, [meetupsSearch]);

    return (
            <div className="flex md:flex-row flex-col w-full flex-grow h-full md:h-[calc(100vh-80px)] justify-between pr-4 py-4 md:p-4 ">
                <div className="mx-4 md:mx-0  relative max-h-screen w-[calc(100%-16px)] md:w-1/2 rounded-xl bg-white dark:bg-neutral-900 flex flex-col ">
                    <div className="flex flex-row p-4 justify-between h-16">

                        <h1 className="text-xl grow font-semibold ">Upcoming Meetups</h1>

                        <Button className="ml-2" color="primary" variant="flat" isIconOnly onClick={() => router.push('/meetups/create')}>
                            <PlusIcon width={20} height={20}/>
                        </Button>
                    </div>
                    <div className="p-4 pt-0 h-14 border-b border-stone-200 dark:border-none">
                    <Input
                        placeholder="Search"
                        value={meetupsSearch}
                        className="w-full "
                        onChange={(e) => setMeetupsSearch(e.target.value)}
                        startContent={<MagnifyingGlassIcon width={20} height={20}/>}
                    />
                    </div>

                    <div className={(meetups.length > 0 ? "grid gap-4 lg:grid-cols-2 grid-cols-1 w-full " : "p-4 pt-4 flex  w-full justify-center items-center") + " bg:stone-100 p-4 h-[calc(100%-200px)] overflow-y-scroll"}>
                        { visibleMeetups.map((meetup, index) => (
                            <div key={index} className="w-full">
                                <MeetupCard meetup={meetup} creator={knownUsers.find((user) => user._id == meetup?.creator) || null} small={true} key={index}/>
                            </div>

                        ))}
                        { meetups.length == 0 &&
                            <><div className="flex flex-col rounded-md w-auto h-auto p-4">
                                <p className="text-2xl font-bold mb-4">No upcoming meetups :(</p>
                                <Button color="primary" className="mt-2 w-full" onClick={() => router.push('/meetups/create')}>Create a meetup</Button>
                            </div></>
                        }
                        </div>

                    <div className="absolute bottom-0 bg:stone-50 z-10 dark:bg-stone-950 border-t dark:border-stone-800 border-stone-200 w-full h-20 flex justify-start items-center">
                        <Link onClick={() => router.push('/meetups')}>
                            <p className="text-base font-semibold ml-4">View all meetups</p>
                        </Link>
                    </div>
                </div>
                <div className="flex flex-col mt-4 mr-4 md:mr-0 w-full md:mt-0 md:w-1/2 h-full pr-4">
                    <div className="relative dark:bg-neutral-900  w-full ml-4 h-full md:h-1/2 max-h-screen overflow-auto rounded-xl  bg-white flex flex-col">
                        <div className="flex flex-row p-4 justify-between">
                            <h1 className="lg:text-xl md:text-lg text-base font-semibold">Recent Notifications</h1>
                            <Link onClick={() => router.push('/notifications')}>
                                <p className="text-base hidden lg:block font-semibold ml-4">View all notifications</p>
                                <p className="text-sm block lg:hidden font-semibold ml-4">View all</p>
                            </Link>
                        </div>
                        <div className="p-4 pt-0 h-14">
                            <Input
                                placeholder="Search"
                                className="w-full "
                                startContent={<MagnifyingGlassIcon width={20} height={20}/>}
                            />
                        </div>
                        <div className="flex flex-col w-full p-4 overflow-y-scroll">
                            { notifications.map((notification, index) => (
                                <NotificationCard onClick={viewNotification} notification={notification} meetup={notification?.meetup? knownMeetups.find((meetup) => meetup?._id == notification.meetup) || null : null} initiator={notification?.initiator ? knownUsers.find((user) => user._id == notification.initiator) || null : null} key={index}/>
                            ))}
                        </div>
                    </div>
                    <div className="relative dark:bg-neutral-900 w-full mt-4 ml-4 md:h-1/2 h-full overflow-auto rounded-xl  bg-white flex flex-col">
                        <div className="flex flex-row p-4 justify-between">
                            <h1 className="text-xl font-semibold">Friends</h1>
                        </div>
                    </div>
                </div>
        </div>

    );
}