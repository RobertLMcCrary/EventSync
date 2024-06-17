"use client";
import { BellIcon } from "@heroicons/react/24/outline";
import { Squares2X2Icon } from "@heroicons/react/24/outline";
import { MapIcon } from "@heroicons/react/24/outline";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { User } from "@/types";
import UserTooltip from "@/app/components/userTooltip";
import { Badge, Skeleton, Popover, PopoverTrigger, PopoverContent, Image, Tooltip } from "@nextui-org/react";
import { useRouter } from 'next13-progressbar';
import { useEffect, useState } from "react";

export default function Sidebar({ active, user, expanded, setExpanded, sidebarRef } : { active: string, user: User | null, expanded: boolean, setExpanded: any, sidebarRef: any}) {
    const router = useRouter();
    const [unreadNotifications, setUnreadNotifications] = useState(0);

    const sidebarItems = [
        "Dashboard",
        "Notifications",
        "Meetups",
        "Friends",
        "Settings"
    ];

    useEffect(() => {
        if (user) {
            setUnreadNotifications(user.notifications.filter(notification => !notification.read).length);
        }
    }, [user]);

    let asideClasses = " relative fixed h-screen hidden  w-24 flex-shrink-0 md:flex flex-col xl:w-64 border-r border:neutral-200 dark:border-neutral-800 bg-white dark:bg-black";

    if (expanded){
        asideClasses = "absolute z-20 h-screen fixed flex-shrink-0 flex flex-col w-64 border-r border:neutral-200 dark:border-neutral-800 bg-white dark:bg-black";
    }

    return (
        <aside ref={sidebarRef} className={asideClasses}>

            <div className="flex absolute top-0 w-full bg-stone-50 dark:bg-stone-950 justify-center border-b dark:border-stone-800 border-stone-200">
                <div className={expanded ? "hidden" : "block"}>
                    <div className="hidden dark:block dark:xl:hidden ">
                        <Image alt="eventsync" src="/sm-dark-logo.png" className="w-20 h-20"/>
                    </div>

                    <div className="block xl:hidden dark:hidden ">
                       <Image onClick={() => router.push('/')} src="/sm-logo.png" alt="eventsync" className="fill-blue-500 w-20 h-20"/>
                   </div>
                </div>
               <div className={(expanded ? "flex dark:hidden" : "hidden xl:flex dark:hidden") + " items-center flex-row max-h-20"}>
                   <p className="text-4xl bg-gradient-to-t text-transparent bg-clip-text font-bold from-teal-300 to-blue-300">event</p>
                   <Image onClick={() => router.push('/')} src="/sm-logo.png" alt="eventsync" className="fill-blue-500 w-20 h-20"/>
               </div>
               <div className={(expanded ? "hidden dark:flex" : "hidden dark:xl:flex") +" hidden items-center flex-row max-h-20"}>
                   <p className="text-4xl bg-gradient-to-t text-transparent bg-clip-text font-bold from-teal-300 to-blue-300">event</p>
                     <Image alt="eventsync" src="/sm-dark-logo.png" className="w-20 h-20"/>
               </div>

            </div>

            <div className="w-full h-full flex items-center">
            <div className="grow flex flex-col items-center w-full justify-items-center">
                {sidebarItems.map((item, index) => (
                    <div key={index} className={(expanded ? "justify-start px-2" : "justify-center xl:justify-start xl:px-2") +" w-full mb-1 flex items-center"}>
                        <div
                            className={(active == item.toString().toLowerCase() ? "bg-stone-100 dark:bg-stone-900 dark:hover:bg-stone-950 hover:bg-stone-50" : (expanded ? "dark:hover:bg-stone-900 hover:bg-stone-100" : "xl:dark:hover:bg-stone-900 xl:hover:bg-stone-100")) + (expanded? " w-full" : " xl:w-full") + " flex flex-row p-2 rounded-lg h-full"}>
                            <a className={expanded ? "hidden" : "block xl:hidden"} onClick={() => router.push('/'+item.toString().toLowerCase())}>
                                {item == "Dashboard" && <Tooltip placement="right" color="primary" content="dashboard"><Squares2X2Icon className={(active == item.toString().toLowerCase() ? "dark:text-white text-black font-semibold" : "dark:text-stone-200 text-stone-800") + " w-6 h-6"}/></Tooltip>}
                                {item == "Notifications" && <Tooltip placement="right" color="primary" content="notifications"><Badge content={unreadNotifications} placement="top-right" color="danger" isInvisible={unreadNotifications == 0}><BellIcon className={(active == item.toString().toLowerCase() ? "text-black dark:text-white font-semibold" : " dark:text-stone-300 text-stone-800") + " w-6 h-6"}/></Badge></Tooltip>}
                                {item == "Meetups" && <Tooltip placement="right" color="primary" content="meetups"><MapIcon className={(active == item.toString().toLowerCase() ? "text-black dark:text-white font-semibold" : "dark:text-stone-300 text-stone-800") + " w-6 h-6"}/></Tooltip>}
                                {item == "Friends" && <Tooltip placement="right" color="primary" content="friends"><UserGroupIcon className={(active == item.toString().toLowerCase() ? "text-black dark:text-white font-semibold" : "dark:text-stone-300 text-stone-800") + " w-6 h-6"}/></Tooltip>}
                                {item == "Settings" && <Tooltip placement="right" color="primary" content="settings"><Cog6ToothIcon className={(active == item.toString().toLowerCase() ? "text-black dark:text-white font-semibold" : "dark:text-stone-300 text-stone-800") + " w-6 h-6"}/></Tooltip>}
                            </a>

                            {item == "Dashboard" && <Squares2X2Icon className={(active == item.toString().toLowerCase() ? "text-black dark:text-white font-semibold" : "dark:text-stone-300 text-stone-800") + (expanded ? " block" : " hidden xl:block") + " w-6 h-6"}/>}
                            {item == "Notifications" && <BellIcon className={(active == item.toString().toLowerCase() ? "text-black dark:text-white font-semibold" : "dark:text-stone-300 text-stone-800") + (expanded ? " block" : " hidden xl:block") + " w-6 h-6"}/>}
                            {item == "Meetups" && <MapIcon className={(active == item.toString().toLowerCase() ? "text-black dark:text-white font-semibold" : "dark:text-stone-300 text-stone-800") + (expanded ? " block" : " hidden xl:block") + "  w-6 h-6"}/>}
                            {item == "Friends" && <UserGroupIcon className={(active == item.toString().toLowerCase() ? "text-black dark:text-white font-semibold" : "dark:text-stone-300 text-stone-800") + (expanded ? " block" : " hidden xl:block") + "  w-6 h-6"}/>}
                            {item == "Settings" && <Cog6ToothIcon className={(active == item.toString().toLowerCase() ? "text-black dark:text-white font-semibold" : "dark:text-stone-300 text-stone-800") + (expanded ? " block" : " hidden xl:block") + " w-6 h-6"}/>}
                                <div className={(expanded ? "flex" : "hidden xl:flex") + " w-full flex-row justify-between"}>
                                    <a onClick={() => router.push('/'+item.toString().toLowerCase())}><p
                                        className={(active == item.toString().toLowerCase() ? "font-semibold" : "dark:text-stone-400 text-stone-600 ") + " ml-4 text-sm mt-0.5 cursor-pointer"}> {item.toString()} </p>
                                    </a>
                                    <div className={(unreadNotifications == 0 || item != "Notifications" ? "hidden" : "") + " rounded-full flex w-auto p-1 h-4 bg-red-500 text-white text-center justify-items-center items-center mt-1  font-bold text-xs "}>
                                        <p>{unreadNotifications}</p>
                                    </div>



                            </div>
                        </div>
                    </div>
                ))}

            </div>
            </div>


            <div className={(expanded ? "justify-start" : "justify-center xl:justify-start") + " bottom-0 absolute border-t items-center p-4 flex flex-row border-stone-200 dark:border-stone-800 w-full max-h-18 dark:bg-stone-950 bg-stone-50"}>
                { user?
                    <Popover backdrop="blur" showArrow placement="top">
                        <PopoverTrigger>
                            <Image alt={user.username} src={user.avatar} className="w-10 h-10 rounded-full hover:brightness-75"/>
                        </PopoverTrigger>
                        <PopoverContent>
                            <UserTooltip user={user}/>
                        </PopoverContent>
                    </Popover>
                    : <Skeleton className="w-10 h-10 rounded-full"/>
                }
                <div className={(expanded ? "flex" : "hidden xl:flex") + " ml-4 flex-col h-full  text-center overflow-ellipsis items-center"}>
                    {user ? <p className="text-xl text-black dark:text-white font-bold overflow-ellipsis">{user.username}</p>
                        : <><Skeleton className="w-36 rounded-xl mb-1 mt-0.5 h-4"/>
                        <Skeleton className="w-36 rounded-xl mb-1 mt-0.5 h-4"/></>
                    }
                </div>
            </div>
        </aside>
    );
}