"use client";
import {usePathname} from "next/navigation";
import React, {Children, useContext, useState} from "react";
import { userContext } from "@/app/providers";
import {Bars3BottomLeftIcon} from "@heroicons/react/24/outline";
import Sidebar from "@/app/components/sidebar";
import {BreadcrumbItem, Breadcrumbs} from "@nextui-org/react";

export default function ProtectedLayout({children}: Readonly<{children: React.ReactNode}>){
    const pathname = usePathname();
    const {user, updateUser} = useContext(userContext);
    const [sidebarExpanded, setSidebarExpanded] = useState(false);

    const [step, setStep] = useState(1);
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
        <div className="relative flex flex-row w-screen h-full">
            <Sidebar active={active} user={user} expanded={sidebarExpanded} setExpanded={setSidebarExpanded}/>

            <div className={(sidebarExpanded ? "blur-sm" : "") + " flex flex-col w-full  bg-stone-100 dark:bg-black"}>
                <div className="flex flex-row items-center min-h-20 h-20 p-4 justify-between w-full bg-white dark:bg-black border-b dark:border-stone-800 border-stone-200">
                    <div className="flex flex-row items-center">
                    <Bars3BottomLeftIcon className="block md:hidden dark:hover:text-white/80 w-6 h-6 mr-4" onClick={() => setSidebarExpanded(!sidebarExpanded)}/>
                    <p className="text-blue-500 text-2xl font-bold">{navName}</p>
                    </div>
                </div>
                { children }
            </div>
        </div>
    )
}