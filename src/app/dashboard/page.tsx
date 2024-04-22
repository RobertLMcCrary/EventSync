"use client";

import Sidebar from "../components/sidebar";
import MeetupCard from "@/app/components/meetupCard";
import {useEffect} from "react";
import {Input, Button, Link} from "@nextui-org/react";
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
        <div className="flex flex-row bg-stone-100 dark:bg-stone-950  h-screen w-screen">
            <Sidebar user={user} active="dashboard"/>
            <div className="flex flex-col h-full w-full ">
                <div className="flex flex-row items-center h-20 p-4 justify-between w-full bg-white dark:bg-black border-b dark:border-stone-800 border-stone-200">
                    <p className="dark:text-white text-2xl font-bold">Dashboard</p>
                    <div className="flex flex-row space-x-4">
                        <Input
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            startContent={<MagnifyingGlassIcon width={20} height={20}/>}
                        />

                    </div>
                </div>
                <div className="flex flex-row w-full flex-grow h-[calc(100%-80px)] justify-between p-4 ">
                    <div className=" dark:border-stone-800 dark:border relative w-1/2 rounded-lg bg-white dark:bg-stone-900 flex flex-col ">
                        <div className="flex flex-row p-4 justify-between h-16">
                            <h1 className="text-xl font-semibold">Upcoming Meetups</h1>
                            <Button color="primary" variant="flat" isIconOnly onClick={() => router.push('/meetups/create')}>
                                <PlusIcon width={20} height={20}/>
                            </Button>
                        </div>
                        <div className={meetups.length > 0 ? "grid gap-4 h-[calc(100%-144px)] md:grid-cols-2 grid-cols-1 overflow-y-scroll lg:flex-col w-full p-4" : "p-4 flex h-full w-full justify-center items-center"}>
                            { meetups.map((meetup, index) => (
                                <div key={index} className="w-full">
                                    <MeetupCard meetup={meetup} creator={knownUsers.find((user) => user._id == meetup?.creator) || null} small={true} key={index}/>
                                </div>

                            ))}
                            { meetups.length == 0 &&
                                <><div className="flex flex-col rounded-md w-auto h-auto p-4">
                                    <p className="text-2xl font-bold mb-4">No meetups :(</p>
                                    <Button color="primary" className="mt-2 w-full" onClick={() => router.push('/meetups/create')}>Create a meetup</Button>
                                </div></>
                            }
                            </div>
                        <div className="absolute bottom-0 bg:stone-50 dark:bg-stone-950 border-t dark:border-stone-800 border-stone-200 w-full h-20 flex justify-start items-center">
                            <Link onClick={() => router.push('/meetups')}>
                                <p className="text-base font-semibold ml-4">View all meetups</p>
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-col w-1/2 h-full pr-4">
                        <div className="relative dark:bg-stone-900 dark:border dark:border-stone-800 w-full ml-4 h-1/2  overflow-auto rounded-lg  bg-white flex flex-col">
                            <div className="flex flex-row p-4 justify-between">
                                <h1 className="text-xl font-semibold">Recent Notifications</h1>
                            </div>
                            <div className="flex flex-col w-full p-4 overflow-y-scroll">
                                { notifications.map((notification, index) => (
                                    <NotificationCard notification={notification} meetup={notification?.meetup? knownMeetups.find((meetup) => meetup?._id == notification.meetup) || null : null} initiator={notification?.initiator ? knownUsers.find((user) => user._id == notification.initiator) || null : null} key={index}/>
                                ))}
                            </div>
                        </div>
                        <div className="relative dark:bg-stone-900 dark:border dark:border-stone-800 w-full mt-4 ml-4 h-1/2  overflow-auto rounded-lg  bg-white flex flex-col">
                            <div className="flex flex-row p-4 justify-between">
                                <h1 className="text-xl font-semibold">IDeas ?</h1>
                            </div>
                        </div>
                    </div>
            </div>
            </div>
        </div>
    );
}