import {Announcement, User} from "@/types";
import {Avatar, Skeleton} from "@nextui-org/react";


export default function AnnouncementCard({announcement, creator}: Readonly<{announcement: Announcement | null, creator: User | null}>) {
    return (
        <div className="border-b border-gray-300 dark:border-gray-700 px-1 pb-3 mb-3">
            <div className="flex flex-row align-middle text-sm text-gray-700 mb-1">
            {announcement && creator ?
                <div className="flex flex-col w-full mt-1">
                    <div className="flex flex-row items-center justify-between gap-2">
                        <div className="flex flex-row w-1/4 items-center gap-2">
                            <Avatar src={creator.avatar} alt={creator.username} className="min-w-6 h-6 rounded-full"/>
                            <p className="text-xs text-gray-500">{creator.username}</p>
                        </div>
                        <p className="dark:text-gray-300 text-black font-bold">{announcement.content}</p>
                    </div>

                </div>
                :
                <div className="flex flex-col w-full mt-1">
                    <div className="flex flex-row items-center justify-between gap-2">
                        <Skeleton className="w-1/2 h-5 rounded-md"/>
                        <div className="flex flex-row w-1/4 items-center gap-2">
                            <Skeleton className="min-w-6 h-6 rounded-full"/>
                            <Skeleton className="w-full h-4 rounded-md"/>
                        </div>
                    </div>
                    <Skeleton className="w-3/4 h-4 rounded-md mt-2"/>
                </div>
            }

        </div>
            </div>
    )
}