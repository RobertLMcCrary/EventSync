// TODO: Completed Friends Page
"use client";
import { useUser, sessionContext } from "@/app/providers";
import {Button, Input, useDisclosure} from "@nextui-org/react";
import {MagnifyingGlassIcon, PlusIcon} from "@heroicons/react/24/solid";
import {UserCard} from "@/app/components/UserCard";
import AddFriendModal from "@/app/components/AddFriendModal";
import {useEffect, useState, useContext} from "react";
import {User} from "@/types";


export default function Friends() {
    const { user, updateUser } = useUser();
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const session = useContext(sessionContext);
    const [friends, setFriends] = useState<(User | null)[]>([null, null, null, null, null, null, null]);
    const [incomingRequests, setIncomingRequests] = useState<(User | null)[]>([null, null, null, null]);

    useEffect(() => {
        if (!user) return;
        if (friends[0] !== null) return;

        const friendPromises = Promise.all(user.friends.map(async (friendID) => {
            const res = await fetch(`/api/user/${friendID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.session.token}`
                }
            });
            if (!res.ok) return null;
            return await res.json();
        }));

        friendPromises.then((friendsData) => {
            let friendsDataFiltered = friendsData.filter((friend) => friend !== null);
            setFriends(friendsDataFiltered.map((friend) => friend as User));
        });

        if (incomingRequests[0] !== null) return;

        const incomingRequestsPromises = Promise.all(user.incomingFriendRequests.map(async (requestID) => {
            const res = await fetch(`/api/user/${requestID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.session.token}`
                }
            });
            if (!res.ok) return null;
            return await res.json();
        }));

        incomingRequestsPromises.then((incomingRequestsData) => {
            let incomingRequestsDataFiltered = incomingRequestsData.filter((request) => request !== null);
            setIncomingRequests(incomingRequestsDataFiltered.map((request) => request as User));
        });

    }, [user, friends, session.session.token, incomingRequests]);


    return (
      <>
          <AddFriendModal isOpen={isOpen} onOpenChange={onOpenChange}/>
        <Button onPress={onOpen} color="primary" variant="flat" className="absolute top-4 right-4" isIconOnly>
            <PlusIcon  className="h-6 w-6"/>
        </Button>

          <Input startContent={ <MagnifyingGlassIcon className="text-gray-400 h-6 w-6"/>} className="absolute top-4 right-16 w-64" placeholder="Search"/>
        <div className="flex w-screen h-full flex-row">
            <div className="flex w-2/3 flex-wrap p-4 gap-4 overflow-y-scroll h-full">
                {friends.map((friend, index) => (
                    <UserCard user={friend} key={index}/>
                ))}
            </div>
            <div className="w-1/3">
                <div className="p-4 bg-white dark:bg-stone-900 h-full shadow-md">
                    <h1 className="text-xl font-semibold">Friend Requests</h1>
                    <div className="flex flex-col gap-4 mt-4">
                        {incomingRequests.map((request, index) => (
                            <div className="dark:border dark:border-gray-800 rounded-xl">
                                <UserCard user={request} key={index}/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

      </>
  )
}