'use client'

import {NextUIProvider} from '@nextui-org/react'
import {ThemeProvider as NextThemesProvider, useTheme} from "next-themes";
import {useRouter} from "next13-progressbar";
import { Next13ProgressBar } from 'next13-progressbar';
import useSession from "@/app/components/utils/sessionProvider";
import { createContext, useState, useEffect, useCallback } from 'react';
import {usePathname} from 'next/navigation';
import {User} from "@/types";
import useUserTheme from "@/app/components/utils/theme/updateTheme";
import { GoogleOAuthProvider } from '@react-oauth/google';

type UserWithUpdate = {
    user: User | null;
    updateUser: () => Promise<void>;
};

const userContext = createContext<UserWithUpdate>({
    user: null,
    updateUser: async () => {},
});
const PROTECTED_ROUTES = ['/dashboard', '/get-started', '/friends', '/meetups', '/notifications', '/settings', '/meetups/create', '/meetups/edit']
export function Providers({children}: { children: React.ReactNode }) {
    const router = useRouter();

    const session = useSession();
    const [user, setUser] = useState<User | null>(null);
    const pathname = usePathname();
    const { setTheme } = useTheme();

    const updateUser = useCallback(async () => {
        fetch(`/api/user/${session.session.userID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.session.token}`
            },
        }).then((data) => {
            data.json().then((userData) => {
                if ("error" in userData){
                    router.push("/login");
                    return;
                }
                setUser(userData);
                console.log(userData.theme);
                setTheme(userData.theme);
            });
        });
    }, [router, session.session.token, session.session.userID, setTheme])

    useEffect(() => {
        // Only fetch user data if the route is protected
        if (pathname == "/login" && user){
            router.push("/dashboard");
            return;
        }

        if (pathname == "/signout") {
            setUser(null);
        }

        if (!PROTECTED_ROUTES.map((route) => pathname.startsWith(route)).includes(true)) return;

        if (session.status == "error") {
            router.push("/login"+(pathname ? `?redirect=${pathname}` : '?redirect=/dashboard'));
            return;
        }

        if (session.status == "done" && !user){
            fetch(`/api/user/${session.session.userID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.session.token}`
                }
            }).then((data) => {
                data.json().then((userData) => {
                    setUser(userData);
                    setTheme(userData.theme);
                })
            });
        }

        const intervalId = setInterval(async () => {
                await updateUser();
        }, 60 * 1000); // 60 seconds

        // Clear the interval when the component is unmounted
        return () => clearInterval(intervalId);

    }, [pathname, router, session.session.token, session.session.userID, session.status, setTheme, updateUser, user]);

    return (
        <NextUIProvider navigate={router.push}>
            <NextThemesProvider attribute="class" defaultTheme="system">
                <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}>
                    <userContext.Provider value={{user, updateUser}}>
                        {children}
                        <Next13ProgressBar height="4px" color="#0A2FFF" options={{ showSpinner: true }} showOnShallow />
                    </userContext.Provider>
                </GoogleOAuthProvider>
            </NextThemesProvider>
        </NextUIProvider>
    )
}

export { userContext }
