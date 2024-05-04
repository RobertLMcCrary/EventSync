"use client";
import {usePathname} from "next/navigation";
import React, {Children, useContext, useEffect, useState} from "react";
import { userContext } from "@/app/providers";
import {Bars3BottomLeftIcon} from "@heroicons/react/24/outline";
import Sidebar from "@/app/components/sidebar";
import {useRouter} from "next13-progressbar";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader, useDisclosure, ModalContent} from "@nextui-org/react";

export default function ProtectedLayout({children}: Readonly<{children: React.ReactNode}>){
    const pathname = usePathname();
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const {user, updateUser} = useContext(userContext);
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const sidebarRef = React.useRef(null);
    const router = useRouter();

    useEffect(() => {
        setSidebarExpanded(false);
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
        <>


        <div className="relative flex flex-row w-screen h-full">
            <Sidebar active={active} sidebarRef={sidebarRef} user={user} expanded={sidebarExpanded} setExpanded={setSidebarExpanded}/>

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
        </>
    )
}