'use client'

import {NextUIProvider} from '@nextui-org/react'
import {ThemeProvider as NextThemesProvider, useTheme} from "next-themes";
import {useRouter} from "next13-progressbar";
import { Next13ProgressBar } from 'next13-progressbar';
import useSession from "@/app/components/utils/sessionProvider";
import React, { createContext, useState, useEffect, useCallback } from 'react';
import {usePathname, useRouter as useNextRouter} from 'next/navigation';
import {User} from "@/types";
import { GoogleOAuthProvider } from '@react-oauth/google';

type UserWithUpdate = {
    user: User | null;
    updateUser: () => Promise<void>;
    setUser: any;
};

const userContext = createContext<UserWithUpdate>({
    user: null,
    updateUser: async () => {},
    setUser: () => {},
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

const globalErrorContext = createContext<{globalError: string, setGlobalError: any}>({
    globalError: "",
    setGlobalError: () => {}
});

const PROTECTED_ROUTES = ['/dashboard', '/get-started', '/friends', '/meetups', '/notifications', '/users', '/settings', '/meetups/create', '/meetups/edit']

export function Providers({children}: { children: React.ReactNode }) {
    const router = useRouter();
    const [globalError, setGlobalError] = useState<string>("");

    const session = useSession();
    const [user, setUser] = useState<User | null>(null);
    const [expired, setExpired] = useState(false);
    const pathname = usePathname();
    const { setTheme } = useTheme();


    const updateUser = useCallback(async () => {
    console.log("loading user");
    if (expired) return;
    fetch(`/api/user/${session.session.userID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.session.token}`
        },
    }).then((res) => {
        if (!res.ok) {
            console.log("update user error");
            setExpired(true);
            return;
        }
        res.json().then((userData) => {
            setUser(userData);
            setTheme(userData.theme);
        });
    });
}, [session.session.token, session.session.userID, expired, setTheme, setUser]);

    useEffect(() => {
        // Only fetch user data if the route is protected
        if (!PROTECTED_ROUTES.map((route) => pathname.startsWith(route)).includes(true)) {
            setExpired(false);
        }

        if (expired) return;

        // If the session has expired, show the modal
        if (session.status == "error") {
            console.log("session error")
            setExpired(true);
            return;
        }

        if (user || session.status == "loading") return;

        fetch(`/api/user/${session.session.userID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.session.token}`
            }
        }).then((res) => {
            if (!res.ok){
                console.log("loading user error");
                setExpired(true);
                return;
            }
            res.json().then((userData) => {
                setUser(userData);
                setTheme(userData.theme);
            })
        });

    }, [expired, router, session.session.token, session.session.userID, session.status, setTheme, updateUser, user, pathname]);


    useEffect(() => {

        const intervalId = setInterval(async () => {
            await updateUser();
        }, 1000 * 60 * 5);

        return () => clearInterval(intervalId);

        }, [updateUser, user]);

    return (
        <NextUIProvider navigate={router.push}>
            <NextThemesProvider attribute="class" defaultTheme="system">
                <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}>
                    <sessionContext.Provider value={session}>
                        <globalErrorContext.Provider value={{globalError, setGlobalError}}>
                        <expiredContext.Provider value={{expired, setExpired}}>
                        <userContext.Provider value={{user, updateUser, setUser}}>
                            {children}
                            <Next13ProgressBar height="4px" color="#0A2FFF" options={{ showSpinner: false }} showOnShallow />
                        </userContext.Provider>
                        </expiredContext.Provider>
                        </globalErrorContext.Provider>
                    </sessionContext.Provider>
                </GoogleOAuthProvider>
            </NextThemesProvider>
        </NextUIProvider>
    )
}

export function useUser(){
    return React.useContext(userContext);
}

export { sessionContext, expiredContext, globalErrorContext }
