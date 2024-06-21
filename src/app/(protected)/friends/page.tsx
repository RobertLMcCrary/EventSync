// TODO: Completed Friends Page
"use client";
import { useUser, sessionContext } from "@/app/providers";
import {Button, Input, Tab, Tabs, useDisclosure} from "@nextui-org/react";
import {CheckIcon, MagnifyingGlassIcon, PlusIcon, XMarkIcon} from "@heroicons/react/24/solid";
import {UserCard} from "@/app/components/UserCard";
import AddFriendModal from "@/app/components/AddFriendModal";
import {useEffect, useState, useContext} from "react";
import {User} from "@/types";


export default function Friends() {
    const { user, setUser } = useUser();
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const session = useContext(sessionContext);
    const [friends, setFriends] = useState<(User | null)[]>([null, null, null, null, null, null, null]);
    const [incomingRequests, setIncomingRequests] = useState<(User | null)[]>([null, null, null, null]);
    const [outgoingRequests, setOutgoingRequests] = useState<(User | null)[]>([null, null, null, null]);

    function fetchFriends(){
        if (!user) return;
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
    }

    async function fetchIncomingRequests(requestID: string) {
        const res = await fetch(`/api/user/${requestID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.session.token}`
            }
        });
        if (!res.ok) return null;
        return await res.json();
    }

    async function fetchOutgoingRequests(requestID: string) {
        const res = await fetch(`/api/user/${requestID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.session.token}`
            }
        });
        if (!res.ok) return null;
        return await res.json();
    }

    useEffect(() => {
        if (!user) return;

        if (friends.includes(null)) {
            setFriends([]);
            fetchFriends();
        }

        if (incomingRequests.includes(null)){
            setIncomingRequests([]);
            const incomingRequestsPromises = Promise.all(user.incomingFriendRequests.map(fetchOutgoingRequests));

            incomingRequestsPromises.then((incomingRequestsData) => {
                let incomingRequestsDataFiltered = incomingRequestsData.filter((request) => request !== null);
                setIncomingRequests(incomingRequestsDataFiltered.map((request) => request as User));
            });
        }

        if (outgoingRequests.includes(null)) {
            setOutgoingRequests([]);
            const outgoingRequestsPromises = Promise.all(user.outgoingFriendRequests.map(fetchOutgoingRequests));

            outgoingRequestsPromises.then((outgoingRequestsData) => {
                let outgoingRequestsDataFiltered = outgoingRequestsData.filter((request) => request !== null);
                setOutgoingRequests(outgoingRequestsDataFiltered.map((request) => request as User));
            });
        }

    }, [user, friends, session.session.token, incomingRequests, outgoingRequests]);

    useEffect(() => {
        if (!user) return;

        if (!incomingRequests.includes(null)) {
            for (let i = 0; i < user.incomingFriendRequests.length; i++) {
                if (incomingRequests[i]?._id !== user.incomingFriendRequests[i]) {
                    fetchIncomingRequests(user.incomingFriendRequests[i]).then((request) => {
                        if (i >= outgoingRequests.length) {
                            setIncomingRequests((incomingRequests) => [
                                ...incomingRequests, request]);
                        } else {
                            setIncomingRequests((incomingRequests) => {
                                const newIncomingRequests = [...incomingRequests];
                                newIncomingRequests.splice(i, 1, request);
                                return newIncomingRequests;
                            });
                        }
                    });
                }
            }
        }

        if (!outgoingRequests.includes(null)) {
            for (let i = 0; i < user.outgoingFriendRequests.length; i++) {
                if (outgoingRequests[i]?._id !== user.outgoingFriendRequests[i]) {
                    fetchOutgoingRequests(user.outgoingFriendRequests[i]).then((request) => {
                        if (i >= outgoingRequests.length) {
                            setOutgoingRequests((outgoingRequests) => [
                                ...outgoingRequests, request]);
                        } else {
                            setOutgoingRequests((outgoingRequests) => {
                                const newOutgoingRequests = [...outgoingRequests];
                                newOutgoingRequests.splice(i, 1, request);
                                return newOutgoingRequests;
                            });
                        }
                    });
                }
            }
        }
    }, [user]);

    async function acceptFriendRequest(friend: User | null) {
        if (!user) return;
        if (!friend) return

        const res = await fetch(`/api/user/${user._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.session.token}`,
            },
            body: JSON.stringify({
                update: {
                    $pull: {
                        incomingFriendRequests: friend._id
                    },
                    $push: {
                        friends: friend._id
                    }
                }
            })
        });

        const res2 = await fetch(`/api/user/${friend._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.session.token}`,
            },
            body: JSON.stringify({
                update: {
                    $pull: {
                        outgoingFriendRequests: user._id
                    },
                    $push: {
                        friends: user._id
                    }
                }
            })
        });

        const res3 = await fetch(`/api/notification/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.session.token}`,
            },
            body: JSON.stringify({
                initiator: user._id,
                receiver: friend._id,
                type: 4,
            })
        });

        setUser((user: User) => {
            if (!user) return user;
            return {
                ...user,
                friends: [...user.friends, friend._id],
                incomingFriendRequests: user.incomingFriendRequests.filter((request) => request !== friend._id)
            }
        });
        setFriends((friends) => [...friends, friend]);
        setIncomingRequests((incomingRequests) => incomingRequests.filter((request) => request !== friend));
    }

    async function declineFriendRequest(friend: User | null) {
        if (!user) return;
        if (!friend) return;

        const res = await fetch(`/api/user/${user._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.session.token}`,
            },
            body: JSON.stringify({
                update: {
                    $pull: {
                        incomingFriendRequests: friend._id
                    }
                }
            })
        });

        const res2 = await fetch(`/api/user/${friend._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.session.token}`,
            },
            body: JSON.stringify({
                update: {
                    $pull: {
                        outgoingFriendRequests: user._id
                    }
                }
            })
        });

        const res3 = await fetch(`/api/notification/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.session.token}`,
            },
            body: JSON.stringify({
                initiator: user._id,
                receiver: friend._id,
                type: 5,
            })
        });

        setIncomingRequests((incomingRequests) => incomingRequests.filter((request) => request !== friend));
        setUser((user: User) => {
            if (!user) return user;
            return {
                ...user,
                incomingFriendRequests: user.incomingFriendRequests.filter((request) => request !== friend._id)
            }
        });
        return;
    }


    async function cancelFriendRequest(friend: User | null) {
        if (!user) return;
        if (!friend) return;

        const res = await fetch(`/api/user/${user._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.session.token}`,
            },
            body: JSON.stringify({
                update: {
                    $pull: {
                        outgoingFriendRequests: friend._id
                    }
                }
            })

        });

        const res2 = await fetch(`/api/user/${friend._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.session.token}`,
            },
            body: JSON.stringify({
                update: {
                    $pull: {
                        incomingFriendRequests: user._id
                    }
                }
            })
        });

        const res3 = await fetch(`/api/notification/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.session.token}`,
            },
            body: JSON.stringify({
                initiator: user._id,
                receiver: friend._id,
                type: 6,
            })
        });

        setOutgoingRequests((outgoingRequests) => outgoingRequests.filter((request) => request !== friend));
        setUser((user: User) => {
            if (!user) return user;
            return {
                ...user,
                outgoingFriendRequests: user.outgoingFriendRequests.filter((request) => request !== friend._id)
            }
        });

        return;
    }

    return (
      <>
          <AddFriendModal setOutgoingFriendRequests={setOutgoingRequests} isOpen={isOpen} onOpenChange={onOpenChange}/>
        <Button onPress={onOpen} color="primary" variant="flat" className="absolute top-4 right-4" isIconOnly>
            <PlusIcon  className="h-6 w-6"/>
        </Button>

          <Input startContent={ <MagnifyingGlassIcon className="text-gray-400 h-6 w-6"/>} className="absolute top-4 right-16 w-64" placeholder="Search"/>
        <div className="flex w-full h-full flex-row">
            <div className={"flex w-2/3 " + (friends.length === 0 ? "items-center justify-center" : "flex-wrap") + " p-4 gap-4 overflow-y-scroll h-full"}>
                {friends.length === 0 ? <p className="text-gray-500 text-lg">No friends yet</p> : null}
                {friends.map((friend, index) => (
                    <UserCard user={friend} key={index}/>
                ))}
            </div>
            <div className="w-1/3">
                <div className="p-4 bg-white w-full dark:bg-stone-900 overflow-y-scroll max-h-full h-full shadow-md">
                    <h1 className="text-xl font-semibold mb-4 ">Friend Requests</h1>
                    <Tabs className="w-full">
                        <Tab title="Received">
                            <div className="flex flex-col gap-4 mt-4">
                                {incomingRequests.map((request, index) => (
                                    <div key={index} className="dark:border dark:border-gray-800 rounded-xl relative">
                                        <UserCard user={request} key={index}/>
                                        <CheckIcon onClick={() => acceptFriendRequest(request)} className="h-6 w-6 absolute top-4 right-4 text-green-500 cursor-pointer"/>
                                        <XMarkIcon onClick={() => declineFriendRequest(request)} className="h-6 w-6 absolute top-4 right-12 text-red-500 cursor-pointer"/>
                                    </div>
                                ))}
                            </div>
                        </Tab>

                        <Tab title="Sent">
                            <div className="flex flex-col gap-4 mt-4">
                                {outgoingRequests.map((request, index) => (
                                    <div key={index} className="dark:border relative dark:border-gray-800 rounded-xl">
                                        <UserCard user={request} key={index}/>
                                        <XMarkIcon onClick={() => cancelFriendRequest(request)} className="h-6 w-6 absolute top-4 right-4 text-red-500 cursor-pointer"/>
                                    </div>
                                ))}
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>

      </>
  )
}