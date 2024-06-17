import {User} from "@/types";
import {Avatar, Skeleton} from "@nextui-org/react";
import {useRouter} from 'next13-progressbar';

export function UserCard({ user } : {user: User | null}) {
    const router = useRouter();

    return (
        <div onClick={() => router.push("/users/")} className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all flex flex-col items-start w-full rounded-xl h-min p-4 bg-white shadow-md dark:bg-neutral-900">

            <div className="flex flex-row">
                {user ?
                    <Avatar src={user?.avatar} alt={user.username} className="min-w-12 h-12 grow"/>
                    :
                    <Skeleton className="rounded-full min-w-12 h-12 grow aspect-square" />
                }
                <div className="ml-4 w-full">
                    {user ?
                        <>
                            <h1 className="text-lg font-semibold">{user?.username}</h1>
                            <p className="text-sm text-gray-500">{user?.bio}</p>
                        </>
                        :
                        <>
                            <Skeleton className="w-1/2 h-5 rounded-md"/>
                            <Skeleton className="w-3/4 h-4 rounded-md mt-2"/>
                        </>
                    }
                </div>

            </div>
            {user?.interests.length > 0 ?
                <div className="flex flex-wrap gap-4 mt-4">
                    {user.interests.map((interest, index) => (
                        <span key={index} className="bg-blue-100 text-blue-500 text-xs px-2 py-1 rounded-md">{interest}</span>
                    ))}
                </div> :
                <p className="text-gray-500 text-sm mt-2">No interests listed</p>
            }
        </div>
    );
}
