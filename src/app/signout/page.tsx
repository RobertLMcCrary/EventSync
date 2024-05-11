'use client';
import Cookies from 'js-cookie';
import {useEffect} from "react";
import {useRouter} from "next13-progressbar";
import {useUser} from "@/app/providers";

export default function Signout() {
    const router = useRouter();
    const {setUser} = useUser();

    useEffect(() => {
        setUser(null);
        Cookies.set("token", "");
        router.push('/login');
    }, [router, setUser]);

    return <div></div>;
}