"use client";

import {useUser} from "@/app/providers";

export default function NotificationsPage() {
    const {user, updateUser} = useUser();

    return (
        <div>
            <h1>Notifications</h1>
        </div>
    );
}