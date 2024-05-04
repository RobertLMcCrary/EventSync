'use client'

import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, NextUIProvider} from '@nextui-org/react'
import {ThemeProvider as NextThemesProvider, useTheme} from "next-themes";
import {useRouter} from "next13-progressbar";
import { Next13ProgressBar } from 'next13-progressbar';
import useSession from "@/app/components/utils/sessionProvider";
import React, { createContext, useState, useEffect, useCallback } from 'react';
import {usePathname} from 'next/navigation';
import {User} from "@/types";
import { GoogleOAuthProvider } from '@react-oauth/google';

type UserWithUpdate = {
    user: User | null;
    updateUser: () => Promise<void>;
};


const userContext = createContext<UserWithUpdate>({
    user: null,
    updateUser: async () => {},
});

type expiredSession = {
    expired: boolean;
    setExpired: any;
}

const expiredContext = createContext<expiredSession>({
    expired: false,
    setExpired: () => {},
});

const sessionContext = createContext<ReturnType<typeof useSession>>({
    session: {
        token: "",
        userID: ""
    },
    status: "loading"
});

const PROTECTED_ROUTES = ['/dashboard', '/get-started', '/friends', '/meetups', '/notifications', '/settings', '/meetups/create', '/meetups/edit']

export function Providers({children}: { children: React.ReactNode }) {
    const router = useRouter();

    const session = useSession();
    const [user, setUser] = useState<User | null>(null);
    const [expired, setExpired] = useState(false);
    const pathname = usePathname();
    const { setTheme } = useTheme();


    const updateUser = useCallback(async () => {
        if (expired) return;
        fetch(`/api/user/${session.session.userID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.session.token}`
            },
        }).then((data) => {
            data.json().then((userData) => {
                if ("error" in userData){
                    setExpired(true);
                    return;
                }
                setUser(userData);
                setTheme(userData.theme);
            });
        });
    }, [expired, session.session.token, session.session.userID, setTheme])

    useEffect(() => {

        // Redirect to the dashboard if the user is already logged in
        if (pathname == "/login" && user){
            router.push("/dashboard");
            return;
        }

        // Sign out the user if they navigate to the signout page
        if (pathname == "/signout") {
            setUser(null);
        }


        // Only fetch user data if the route is protected
        if (!PROTECTED_ROUTES.map((route) => pathname.startsWith(route)).includes(true)) {
            setExpired(false);
            return;
        }

        // If the session has expired, show the modal
        if (session.status == "error") {
            setExpired(true);
            return;
        }

        // If the session data is loaded, fetch the user data
        if (session.status == "done" && !user){
            fetch(`/api/user/${session.session.userID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.session.token}`
                }
            }).then((data) => {
                data.json().then((userData) => {

                    if ("error" in userData){
                        setExpired(true);
                        return;
                    }

                    setUser(userData);
                    setTheme(userData.theme);
                })
            });
        }

        // fetch user data every 60 seconds
        const intervalId = setInterval(async () => {
            await updateUser();
        }, 60 * 1000); // 60 seconds

        // Clear the interval when the component is unmounted
        return () => clearInterval(intervalId);

    }, [pathname, expired, router, session.session.token, session.session.userID, session.status, setTheme, updateUser, user]);

    return (
        <NextUIProvider navigate={router.push}>
            <NextThemesProvider attribute="class" defaultTheme="system">
                <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}>
                    <sessionContext.Provider value={session}>
                        <expiredContext.Provider value={{expired, setExpired}}>
                        <userContext.Provider value={{user, updateUser}}>
                            <Modal isDismissable={false} isOpen={expired}>
                                <ModalContent>
                                    <ModalHeader>Session Expired</ModalHeader>
                                    <ModalBody>
                                        You are not logged in or your session has expired.
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onClick={() => {
                                            setExpired(false);
                                            setUser(null);
                                            router.push('/login?redirect='+ pathname);
                                        }}>
                                            Log In
                                        </Button>
                                    </ModalFooter>
                                </ModalContent>
                            </Modal>
                            {children}
                            <Next13ProgressBar height="4px" color="#0A2FFF" options={{ showSpinner: false }} showOnShallow />
                        </userContext.Provider>
                        </expiredContext.Provider>
                    </sessionContext.Provider>
                </GoogleOAuthProvider>
            </NextThemesProvider>
        </NextUIProvider>
    )
}

export { userContext,  sessionContext, expiredContext }
