"use client";
import { BellIcon } from "@heroicons/react/24/outline";
import { Squares2X2Icon } from "@heroicons/react/24/outline";
import { MapIcon } from "@heroicons/react/24/outline";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { User } from "@/types";
import UserTooltip from "@/app/components/userTooltip";
import {useState} from "react";
import { Skeleton, Accordion, AccordionItem, Image } from "@nextui-org/react";
import { useRouter } from 'next13-progressbar';

export default function Sidebar({ active, user } : { active: string, user: User | null}) {
    let [tooltip, setTooltip] = useState(false);
    const router = useRouter();

    function showUserTooltip(){
        setTooltip(true);
    }

    function hideUserTooltip(){
        setTooltip(false);
    }

    return (
        <aside className=" relative  hidden  justify-items-between items-between ith-screen w-24 flex-shrink-0 md:flex flex-col justify-evenly xl:w-64 border-r border:neutral-200 dark:border-neutral-800 bg-stone-50 dark:bg-stone-950">
            <div className="flex justify-center">
               <div className="block xl:hidden dark:hidden">
                   <Image src="/sm-logo.png" alt="eventsync" className="w-20 h-20"/>
               </div>
               <div className="hidden xl:block dark:hidden">
                    <Image alt="eventsync" src="/xl-logo.png" className=""/>
               </div>
               <div className="hidden dark:xl:block">
                     <Image alt="eventsync" src="/xl-dark-logo.png" className="w-56 h-56"/>
               </div>
               <div className="hidden dark:block dark:xl:hidden ">
                   <Image alt="eventsync" src="/sm-dark-logo.png" className="w-20 h-20"/>
               </div>
            </div>


            <div className="grow flex flex-col items-center justify-items-center">
                <div className={(active == "dashboard" ? "border-r-2 border-blue-600 rounded-sm " : " ") + " w-full mb-1 flex justify-center xl:justify-start xl:px-2"}>
                    <div className={(active =="dashboard" ? "" : "dark:bg-stone-900 dark:hover:bg-stone-800") + " flex flex-row p-2 rounded-lg h-full xl:w-full"}>
                        <a className="block xl:hidden" onClick={() => router.push('/dashboard')}><Squares2X2Icon className={(active == "dashboard" ? "text-blue-700 hover:text-blue-500 xl:hover:text-blue-700" : "dark:text-neutral-500 hover:text-neutral-500 xl:hover:text-neutral-400 dark:hover:text-neutral-400 xl:dark:hover:text-neutral-500 text-neutral-400") + " w-6 h-6"}/></a>
                        <Squares2X2Icon className={(active == "dashboard" ? "text-blue-700 hover:text-blue-500 xl:hover:text-blue-700" : "dark:text-neutral-500 hover:text-neutral-500 xl:hover:text-neutral-400 dark:hover:text-neutral-400 xl:dark:hover:text-neutral-500 text-neutral-400") + " hidden xl:block w-6 h-6"}/>
                        <a onClick={() => router.push('/dashboard')}><p className={(active == "dashboard" ? "dark:text-white text-black hover:text-neutral-600 font-bold dark:hover:text-neutral-300" : "text-neutral-400 dark:hover:text-neutral-300 hover:text-neutral-500") + " hidden xl:block ml-4 text-sm mt-0.5 cursor-pointer"}> Dashboard </p></a>
                    </div>
                </div>
                <div className={(active == "notifications" ? "border-r-2 border-blue-600 rounded-sm " : " ") + " w-full mb-1 flex justify-center xl:justify-start xl:px-2"}>
                    <div className={(active =="notifications" ? "" : "dark:bg-stone-900 dark:hover:bg-stone-800") + " flex flex-row p-2 rounded-lg h-full xl:w-full"}>
                        <a className="block xl:hidden" onClick={() => router.push('/notifications')}><BellIcon className={(active == "notifications" ? "text-blue-700 hover:text-blue-500 xl:hover:text-blue-700" : "dark:text-neutral-500 hover:text-neutral-500 xl:hover:text-neutral-400 dark:hover:text-neutral-400 xl:dark:hover:text-neutral-500 text-neutral-400") + " w-6 h-6"}/></a>
                        <BellIcon className={(active == "notifications" ? "text-blue-700 hover:text-blue-500 xl:hover:text-blue-700" : "dark:text-neutral-500 hover:text-neutral-500 xl:hover:text-neutral-400 dark:hover:text-neutral-400 xl:dark:hover:text-neutral-500 text-neutral-400") + " hidden xl:block w-6 h-6"}/>
                        <a onClick={() => router.push('/notifications')}><p className={(active == "notifications" ? "dark:text-white text-black hover:text-neutral-600 font-bold dark:hover:text-neutral-300" : "text-neutral-400 dark:hover:text-neutral-300 hover:text-neutral-500") + " hidden xl:block ml-4 text-sm mt-0.5 cursor-pointer"}> Notifications </p></a>
                    </div>
                </div>

                <div className={(active == "meetups" ? "border-r-2 border-blue-600 rounded-sm " : " ") + " w-full mb-1 flex justify-center xl:justify-start xl:px-2"}>
                    <div className={(active =="meetups" ? "" : "dark:bg-stone-900 dark:hover:bg-stone-800") + " flex flex-row p-2 rounded-lg h-full xl:w-full"}>
                        <a className="block xl:hidden" onClick={() => router.push('/meetups')}><MapIcon className={(active == "meetups" ? "text-blue-700 hover:text-blue-500 xl:hover:text-blue-700" : "dark:text-neutral-500 hover:text-neutral-500 xl:hover:text-neutral-400 dark:hover:text-neutral-400 xl:dark:hover:text-neutral-500 text-neutral-400") + " w-6 h-6"}/></a>
                        <MapIcon className={(active == "meetups" ? "text-blue-700 hover:text-blue-500 xl:hover:text-blue-700" : "dark:text-neutral-500 hover:text-neutral-500 xl:hover:text-neutral-400 dark:hover:text-neutral-400 xl:dark:hover:text-neutral-500 text-neutral-400") + " hidden xl:block w-6 h-6"}/>
                        <a onClick={() => router.push('/meetups')}><p className={(active == "meetups" ? "dark:text-white text-black hover:text-neutral-600 font-bold dark:hover:text-neutral-300" : "text-neutral-400 dark:hover:text-neutral-300 hover:text-neutral-500") + " hidden xl:block ml-4 text-sm mt-0.5 cursor-pointer"}> Meetups </p></a>
                    </div>
                </div>

                <div className={(active == "friends" ? "border-r-2 border-blue-600 rounded-sm " : " ") + " w-full mb-1 flex justify-center xl:justify-start xl:px-2"}>
                    <div className={(active =="friends" ? "" : "dark:bg-stone-900 dark:hover:bg-stone-800") + "  flex flex-row p-2 rounded-lg h-full xl:w-full"}>
                        <a className="block xl:hidden" onClick={() => router.push('/friends')}><UserGroupIcon className={(active == "friends" ? "text-blue-700 hover:text-blue-500 xl:hover:text-blue-700" : "dark:text-neutral-500 hover:text-neutral-500 xl:hover:text-neutral-400 dark:hover:text-neutral-400 xl:dark:hover:text-neutral-500 text-neutral-400") + " w-6 h-6"}/></a>
                        <UserGroupIcon className={(active == "friends" ? "text-blue-700 hover:text-blue-500 xl:hover:text-blue-700" : "dark:text-neutral-500 hover:text-neutral-500 xl:hover:text-neutral-400 dark:hover:text-neutral-400 xl:dark:hover:text-neutral-500 text-neutral-400") + " hidden xl:block w-6 h-6"}/>
                        <a onClick={() => router.push('/friends')}><p className={(active == "friends" ? "dark:text-white text-black hover:text-neutral-600 font-bold dark:hover:text-neutral-300" : "text-neutral-400 dark:hover:text-neutral-300 hover:text-neutral-500") + " hidden xl:block ml-4 text-sm mt-0.5 cursor-pointer"}> Friends </p></a>
                    </div>
                </div>

                <div className={(active == "settings" ? "border-r-2 border-blue-600 rounded-sm " : " ") + " w-full mb-1 flex justify-center xl:justify-start xl:px-2"}>
                    <div className={(active =="settings" ? "" : "dark:bg-stone-900 dark:hover:bg-stone-800") + " flex flex-row p-2 rounded-lg h-full xl:w-full "}>
                        <a className="block xl:hidden" onClick={() => router.push('/settings')}><Cog6ToothIcon className={(active == "settings" ? "text-blue-700 hover:text-blue-500 xl:hover:text-blue-700" : "dark:text-neutral-500 hover:text-neutral-500 xl:hover:text-neutral-400 dark:hover:text-neutral-400 xl:dark:hover:text-neutral-500 text-neutral-400") + " w-6 h-6"}/></a>
                        <Cog6ToothIcon className={(active == "settings" ? "text-blue-700 hover:text-blue-500 xl:hover:text-blue-700" : "dark:text-neutral-500 hover:text-neutral-500 xl:hover:text-neutral-400 dark:hover:text-neutral-400 xl:dark:hover:text-neutral-500 text-neutral-400") + " hidden xl:block w-6 h-6"}/>
                        <a onClick={() => router.push('/settings')}><p className={(active == "settings" ? "dark:text-white text-black hover:text-neutral-600 font-bold dark:hover:text-neutral-300" : "text-neutral-400 dark:hover:text-neutral-300 hover:text-neutral-500") + " hidden xl:block ml-4 text-sm mt-0.5 cursor-pointer"}> Settings </p></a>
                    </div>
                </div>
            </div>



            {tooltip && user && <UserTooltip user={user} hideTooltip={hideUserTooltip} />}


            <div className=" justify-center bottom-0 absolute border-t items-center p-4 xl:justify-start flex flex-row border-neutral-200 dark:border-neutral-800 w-full max-h-18 dark:bg-neutral-900 bg-neutral-100">
                { user? <Image alt={user.username} src={user.avatar} onClick={showUserTooltip} className="w-10 h-10 rounded-full hover:opacity-90"/>
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