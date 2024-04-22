"use client";

import Sidebar from "../components/sidebar";
import MeetupCard from "@/app/components/meetupCard";
import {useEffect} from "react";
import {Input, Button} from "@nextui-org/react";
import {MagnifyingGlassIcon, PlusIcon} from "@heroicons/react/24/solid";
import NotificationCard from "@/app/components/notification";
import useDashboardState from "@/app/dashboard/useDashboardState";
import fetchData from './fetchData';


export default function Dashboard() {
    const { user, meetups, setMeetups, search, setSearch, knownUsers, setKnownUsers, notifications, setNotifications, router, session, status, knownMeetups, setKnownMeetups} = useDashboardState();

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
            setKnownMeetups
        });
    }, [meetups, notifications, session, knownUsers, router, status, user, setKnownUsers, setNotifications, setMeetups]);


    return (
        <div className="flex flex-row bg-stone-100 dark:bg-black h-screen w-screen">
            <Sidebar user={user} active="dashboard"/>
            <div className="flex flex-row h-full w-full">
                <div className="w-2/3 lg:h-full flex flex-col">
                    <div className="flex flex-row items-center justify-between p-4 border-b bg-white dark:border-stone-800 dark:bg-stone-950">
                        <p className="dark:text-white text-2xl font-bold">Meetups</p>
                        <div className="flex flex-row space-x-4">
                            <Input
                                placeholder="Search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                startContent={<MagnifyingGlassIcon width={20} height={20}/>}
                            />
                            <Button color="primary" variant="flat" isIconOnly onClick={() => router.push('/meetups/create')}>
                                <PlusIcon width={20} height={20}/>
                            </Button>
                        </div>
                    </div>
                    <div className={meetups.length > 0 ? "grid space-x-4 space-y-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 overflow-y-scroll lg:flex-col w-full h-full p-4" : "flex h-full w-full justify-center items-center"}>
                        { meetups.map((meetup, index) => (
                            <div key={index} className="">
                                <MeetupCard meetup={meetup} creator={knownUsers.find((user) => user._id == meetup?.creator) || null} small={true} key={index}/>
                            </div>

                        ))}
                        { meetups.length == 0 &&
                            <><div className="flex flex-col rounded-md w-auto h-auto p-4">
                                <p className="text-2xl font-bold dark:text-white mb-4">No meetups :(</p>
                                <Button color="primary" className="mt-2 w-full" onClick={() => router.push('/meetups/create')}>Create a meetup</Button>
                            </div></>
                        }
                        </div>
                </div>
                <div className="w-1/3 lg:h-full border-l dark:border-stone-800 dark:bg-stone-950 bg-stone-50 flex flex-col">
                    <p className="dark:text-white text-2xl flex text-center font-bold bg-white dark:bg-transparent border-b dark:border-stone-800 p-4 py-5">Notifications</p>
                    <div className="flex flex-col w-full p-4 overflow-y-scroll">
                        { notifications.map((notification, index) => (
                            <NotificationCard notification={notification} meetup={notification?.meetup? knownMeetups.find((meetup) => meetup?._id == notification.meetup) || null : null} initiator={notification?.initiator ? knownUsers.find((user) => user._id == notification.initiator) || null : null} key={index}/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}