"use client";
import {Suspense, useContext, useState} from 'react';
import { userContext } from '@/app/providers';
import { User } from '@/types';
import useSession from "@/app/components/utils/sessionProvider";
import { useRouter } from 'next13-progressbar';
import { CheckIcon } from '@heroicons/react/24/solid';
import { useSearchParams } from 'next/navigation';
import {Button, Avatar, Input, Textarea, Skeleton} from '@nextui-org/react';

function GetStartedComponent(){
    const {user, updateUser} = useContext(userContext);
    const [updatedUser, setUpdatedUser] = useState<User | null>(null);
    const {session, status} = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const [avatar, setAvatar] = useState<string>("");
    const router = useRouter();

    const defaultAvatars = [
        "https://plus.unsplash.com/premium_photo-1668627147050-4f4525502777?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bmF0aW9uYWwlMjBwYXJrc3xlbnwwfHwwfHx8MA%3D%3D",
        "https://images.unsplash.com/photo-1502856755506-d8626589ef19?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bmF0aW9uYWwlMjBwYXJrc3xlbnwwfHwwfHx8MA%3D%3D",
        "https://images.unsplash.com/photo-1606859309981-270838d57ed8?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bmF0aW9uYWwlMjBwYXJrc3xlbnwwfHwwfHx8MA%3D%3D",
        "https://images.unsplash.com/photo-1602707063633-bc4308339b5c?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fG5hdGlvbmFsJTIwcGFya3N8ZW58MHx8MHx8fDA%3D",

    ]
    if (user) {
        if (!updatedUser) setUpdatedUser(user);

    }

    function submit(){
        if (!updatedUser) return;
        if (!user) return;
        setIsLoading(true);

        const updateData: any = {
            update: {
                $set: {
                    bio: updatedUser.bio,
                    location: updatedUser.location,
                    avatar: updatedUser.avatar,
                }
            }
        }

        if (updatedUser.username != user.username){
            updateData["update"]["$set"]["username"] = updatedUser.username;
        }
        if (user.password.length == 0){
            updateData["update"]["$set"]["password"] = updatedUser.password;
        }

        fetch(`/api/user/${updatedUser._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`
            },
            body: JSON.stringify(updateData)
        }).then((res) => {
            setIsLoading(false);
            if (res.ok) {
                updateUser();
                if (searchParams.has('redirect')) {
                    router.push(searchParams.get('redirect') || 'dashboard');
                } else {
                    router.push('/dashboard');
                }
            } else {
                res.json().then((data) => {
                    setError(data.error);
                });
            }
        });
    }


    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen bg-white dark:bg-black">
            <div className="flex flex-col justify-items-start p-8">
                <h1 className="text-3xl font-bold mb-8 ">Welcome! Let&apos;s create your profile</h1>
                <div className={user?.password && user?.username ? "hidden" : "flex flex-row justify-between mb-6 items-center w-full"}>
                    <div className="flex flex-col w-1/2">
                        <h1 className="text-lg font-semibold mb-4 ">Username</h1>
                        <Input placeholder="Username" size="lg" className="w-full" value={updatedUser?.username} onChange={(e) => setUpdatedUser({...updatedUser, username: e.target.value} as User)}/>
                    </div>

                    <div className="fle flex-col w-1/2 ml-4">
                        <h1 className="text-lg font-semibold mb-4 ">Password</h1>
                        <Input placeholder="Password" size="lg" className="w-full" value={updatedUser?.password} onChange={(e) => setUpdatedUser({...updatedUser, password: e.target.value} as User)}/>
                    </div>
                </div>
                <h1 className="text-lg font-semibold mb-4 ">Choose your avatar</h1>
                <div className="flex flex-row justify-between items-center ">
                    <Avatar src={updatedUser?.avatar} size="lg" className="w-44 h-44 rounded-full "/>
                    <div className="flex flex-col ml-8">
                    <Input endContent={<CheckIcon onClick={(e) => setUpdatedUser({...updatedUser, avatar: avatar} as User)} className="w-6 h-6 text-green-500"/>} onChange={(e) => setAvatar(e.target.value)} placeholder="Avatar URL" size="lg" className="w-auto mb-4" />
                        <p className="text-base font-bold mb-2 ml-0.5 dark:text-stone-400">Or choose a default image</p>
                        <div className="flex flex-row">
                            {defaultAvatars.map((avatar, index) => (
                                <Avatar isBordered={updatedUser?.avatar == avatar} key={index} src={avatar} size="md" className="w-12 h-12 rounded-full m-2" onClick={() => setUpdatedUser({...updatedUser, avatar} as User)}/>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex flex-row justify-between mt-8">
                    <div className="flex flex-col w-1/2">
                        <h1 className="text-lg font-semibold mb-4 ">Set your Location</h1>
                        <Input placeholder="Enter your location" size="lg" className="w-full" value={updatedUser?.location} onChange={(e) => setUpdatedUser({...updatedUser, location: e.target.value} as User)}/>
                        <Button isDisabled={!updatedUser?.avatar || !updatedUser?.username || !updatedUser?.password || !updatedUser?.location || !updatedUser?.bio} color="primary" className="mt-4" onClick={submit} isLoading={isLoading}>Complete</Button>
                    </div>
                    <div className="flex flex-col w-1/2 ml-4">
                        <h1 className="text-lg font-semibold mb-4 ">Bio</h1>
                        <Textarea
                            onChange={(e) => setUpdatedUser({...updatedUser, bio: e.target.value} as User)}
                            label="Bio"
                            value={updatedUser?.bio}
                            placeholder="Describe yourself"
                            className="max-w-xs"
                        />
                    </div>
                </div>

                {error && <p className="text-red-500">{error}</p>}
            </div>
        </div>

    )
}

export default function GetStarted() {
    return (
        <Suspense fallback={
            <div className="w-[400px] h-[400px]">
                <Skeleton className="w-full h-5 mb-1" />
                <Skeleton className="w-[4/5] h-5 mb-1" />
                <Skeleton className="w-full h-5 mb-4" />
                <Skeleton className="w-full h-5 mb-1" />
                <Skeleton className="w-full h-5" />
            </div>
        }>
            <GetStartedComponent />
        </Suspense>
    );
}
