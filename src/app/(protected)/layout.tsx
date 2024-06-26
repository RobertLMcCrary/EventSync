"use client";
import {usePathname} from "next/navigation";
import React, {useEffect, useState} from "react";
import { useUser } from "@/app/providers";
import {Bars3BottomLeftIcon} from "@heroicons/react/24/outline";
import Sidebar from "@/app/components/sidebar";

export default function ProtectedLayout({children}: Readonly<{children: React.ReactNode}>){
    const pathname = usePathname();
    const {user, updateUser} = useUser();
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const sidebarRef = React.useRef(null);

    useEffect(() => {
       if (sidebarExpanded) setSidebarExpanded(false);
    }, [pathname]);

    useEffect(() => {
        function handleClickOutside(event: { target: any; }) {
            // @ts-ignore
            if (sidebarRef.current && !sidebarRef.current.contains(event.target) && sidebarExpanded) {
                setSidebarExpanded(false)
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [sidebarExpanded, sidebarRef]);

    let active;
    let navName;

    if (pathname.startsWith('/dashboard')){
        active = 'dashboard';
        navName = 'Dashboard';
    } else if (pathname.startsWith('/meetups')){
        active = 'meetups';
        if (pathname.startsWith('/meetups/create')){
            navName = 'Create Meetup';
        } else if (pathname.startsWith('/meetups/invite')){
            navName = "Meetup Invite"
        } else if (pathname.endsWith('edit')){
            navName = "Edit Meetup"
        } else if (pathname == '/meetups'){
            navName = 'Meetups';
        } else {
            navName = 'View Meetup';
        }
    } else if (pathname.startsWith('/settings')){
        active = 'settings';
        navName = 'Settings';
    } else if (pathname.startsWith('/notifications')){
        active = 'notifications';
        navName = 'Notifications';
    } else {
        active = 'friends';
        navName = 'Friends';
    }

    return (
        <div className="relative flex flex-row bg-gray-100 dark:bg-black w-screen h-full">
            <Sidebar active={active} sidebarRef={sidebarRef} user={user} expanded={sidebarExpanded} setExpanded={setSidebarExpanded}/>

            <div className={(sidebarExpanded ? "blur-sm" : " md:w-[calc(100%-96px)] md:ml-24 xl:ml-64 xl:w-[calc(100%-256px)]") + " w-full flex flex-col  bg-stone-100 dark:bg-black"}>
                <div className="flex fixed z-30 flex-row items-center min-h-20 h-20 p-4 justify-between w-full bg-white/50 dark:bg-black/50 backdrop-blur border-b dark:border-stone-800 border-stone-200">
                    <div className="flex flex-row items-center">
                    <Bars3BottomLeftIcon className="block md:hidden dark:hover:text-white/80 w-6 h-6 mr-4" onClick={() => setSidebarExpanded(!sidebarExpanded)}/>
                    <p className="text-blue-500 text-2xl font-bold">{navName}</p>
                    </div>
                </div>
                <div className="mt-20 h-full">
                    { children }
                </div>
            </div>
        </div>
    )
}