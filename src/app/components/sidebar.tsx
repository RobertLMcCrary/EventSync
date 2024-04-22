"use client";
import { BellIcon } from "@heroicons/react/24/outline";
import { Squares2X2Icon } from "@heroicons/react/24/outline";
import { MapIcon } from "@heroicons/react/24/outline";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { User } from "@/types";
import UserTooltip from "@/app/components/userTooltip";
import { Skeleton, Popover, PopoverTrigger, PopoverContent, Image, Tooltip } from "@nextui-org/react";
import { useRouter } from 'next13-progressbar';

export default function Sidebar({ active, user } : { active: string, user: User | null}) {
    const router = useRouter();

    const sidebarItems = [
        ["Dashboard"],
        "Notifications",
        "Meetups",
        "Friends",
        "Settings"
    ];

    return (
        <aside className=" relative  hidden  w-24 flex-shrink-0 md:flex flex-col xl:w-64 border-r border:neutral-200 dark:border-neutral-800 bg-white dark:bg-black">
            <div className="flex absolute top-0 w-full bg-stone-50 dark:bg-stone-950 justify-center border-b dark:border-stone-800 border-stone-200">
               <div className="block xl:hidden dark:hidden">
                   <Image src="/sm-logo.png" alt="eventsync" className="w-20 h-20"/>
               </div>
               <div className="hidden xl:block dark:hidden">
                    <Image alt="eventsync" src="/xl-logo.png" className="w-56 h-16"/>
               </div>
               <div className="hidden dark:xl:block">
                     <Image alt="eventsync" src="/xl-dark-logo.png" className="w-56 h-56"/>
               </div>
               <div className="hidden dark:block dark:xl:hidden ">
                   <Image alt="eventsync" src="/sm-dark-logo.png" className="w-20 h-20"/>
               </div>
            </div>

            <div className="w-full h-full flex items-center">
            <div className="grow flex flex-col items-center justify-items-center">
                {sidebarItems.map((item, index) => (
                    <div key={index} className=" w-full mb-1 flex justify-center items-center xl:justify-start xl:px-2">
                        <div
                            className={(active == item.toString().toLowerCase() ? "bg-stone-100 dark:bg-stone-900 dark:hover:bg-stone-950 hover:bg-stone-50" : "xl:dark:hover:bg-stone-900 xl:hover:bg-stone-200") + " flex flex-row p-2 rounded-lg h-full xl:w-full"}>
                            <a className="block xl:hidden" onClick={() => router.push('/'+item.toString().toLowerCase())}>
                                {item == "Dashboard" && <Tooltip placement="right" color="primary" content="dashboard"><Squares2X2Icon className={(active == item.toString().toLowerCase() ? "dark:text-white text-black font-semibold" : "dark:text-stone-200 text-stone-800") + " w-6 h-6"}/></Tooltip>}
                                {item == "Notifications" && <Tooltip placement="right" color="primary" content="notifications"><BellIcon className={(active == item.toString().toLowerCase() ? "text-black dark:text-white font-semibold" : " dark:text-stone-300 text-stone-800") + " w-6 h-6"}/></Tooltip>}
                                {item == "Meetups" && <Tooltip placement="right" color="primary" content="meetups"><MapIcon className={(active == item.toString().toLowerCase() ? "text-black dark:text-white font-semibold" : "dark:text-stone-300 text-stone-800") + " w-6 h-6"}/></Tooltip>}
                                {item == "Friends" && <Tooltip placement="right" color="primary" content="friends"><UserGroupIcon className={(active == item.toString().toLowerCase() ? "text-black dark:text-white font-semibold" : "dark:text-stone-300 text-stone-800") + " w-6 h-6"}/></Tooltip>}
                                {item == "Settings" && <Tooltip placement="right" color="primary" content="settings"><Cog6ToothIcon className={(active == item.toString().toLowerCase() ? "text-black dark:text-white font-semibold" : "dark:text-stone-300 text-stone-800") + " w-6 h-6"}/></Tooltip>}
                            </a>
                            {item == "Dashboard" && <Squares2X2Icon className={(active == item.toString().toLowerCase() ? "text-black dark:text-white font-semibold" : "dark:text-stone-300 text-stone-800") + " hidden xl:block w-6 h-6"}/>}
                            {item == "Notifications" && <BellIcon className={(active == item.toString().toLowerCase() ? "text-black dark:text-white font-semibold" : "dark:text-stone-300 text-stone-800") + " hidden xl:block w-6 h-6"}/>}
                            {item == "Meetups" && <MapIcon className={(active == item.toString().toLowerCase() ? "text-black dark:text-white font-semibold" : "dark:text-stone-300 text-stone-800") + " hidden xl:block w-6 h-6"}/>}
                            {item == "Friends" && <UserGroupIcon className={(active == item.toString().toLowerCase() ? "text-black dark:text-white font-semibold" : "dark:text-stone-300 text-stone-800") + " hidden xl:block w-6 h-6"}/>}
                            {item == "Settings" && <Cog6ToothIcon className={(active == item.toString().toLowerCase() ? "text-black dark:text-white font-semibold" : "dark:text-stone-300 text-stone-800") + " hidden xl:block w-6 h-6"}/>}
                            <div className="flex w-full flex-row justify-between">
                            <a onClick={() => router.push('/'+item.toString().toLowerCase())}><p
                                className={(active == item.toString().toLowerCase() ? "font-semibold" : "dark:text-stone-400 text-stone-600 ") + " hidden xl:block ml-4 text-sm mt-0.5 cursor-pointer"}> {item.toString()} </p>
                            </a>

                            <div className="rounded-full  w-auto p-1 h-4 bg-red-500 text-white text-center justify-items-center items-center mt-1  font-bold text-xs hidden xl:flex">
                                <p>3</p>
                            </div>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
            </div>


            <div className=" justify-center bottom-0 absolute border-t items-center p-4 xl:justify-start flex flex-row border-stone-200 dark:border-stone-800 w-full max-h-18 dark:bg-stone-950 bg-stone-100">
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
                <div className="hidden xl:flex ml-4  flex-col h-full  text-center overflow-ellipsis items-center">
                    {user ? <p className="text-xl text-black dark:text-white font-bold overflow-ellipsis">{user.username}</p>
                        : <Skeleton className="w-36 rounded-xl mb-1 mt-0.5 h-4"/>
                    }
                </div>
            </div>
        </aside>
    );
}