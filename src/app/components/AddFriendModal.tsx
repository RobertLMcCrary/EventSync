import React, {useEffect} from 'react';
import {useState, useContext} from 'react';
import {Button, Input, Modal, ModalContent} from '@nextui-org/react';
import {CheckIcon} from "@heroicons/react/24/solid";
import {useUser, sessionContext} from "@/app/providers";
import {User} from "@/types";
import {UserCard} from "@/app/components/UserCard";


export default function AddFriendModal({isOpen, onOpenChange, setOutgoingFriendRequests}: Readonly<{isOpen: boolean, onOpenChange: (open: boolean) => void, setOutgoingFriendRequests: any}>){
    const [email, setEmail] = useState<string>("");
    const {user, setUser} = useUser();
    const session = useContext(sessionContext);
    const [error, setError] = useState<string>("");
    const [friend, setFriend] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);

    useEffect(() => {
        if (!isOpen) {
            setEmail("");
            setFriend(null);
            setError("");
            setLoading(false);
            setSuccess(false);
        }
    }, [isOpen]);

    async function addFriend() {
        if (!user) return;
        if (loading) return;
        setError("")

        setLoading(true)

        // Check if email is valid

        if (email == user?.email){
            setError("You can't add yourself as a friend");
            return;
        }

        const res = await fetch('/api/user/find', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.session.token}`
            },
            body: JSON.stringify({
                email
            })
        });

        setLoading(false);

        if (!res.ok){
            setError("User not found");
            return;
        }

        const friend = await res.json() as User;

        if (user.friends.includes(friend._id)){
            setError("User is already your friend");
            return;
        }

        if (user.incomingFriendRequests.includes(friend._id)){
            setError("User already sent you a friend request");
            return;
        }

        if (user.outgoingFriendRequests.includes(friend._id)){
            setError("You already sent a friend request to this user");
            return;
        }

        setFriend(friend);
    }

    async function confirmFriend() {
        if (!user || !friend) return;
        setLoading(true);

        const res = await fetch(`/api/user/${user._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.session.token}`
            },
            body: JSON.stringify({
                update: {
                    $push: {
                        outgoingFriendRequests: friend._id
                    }
                }
            })
        });

        const res2 = await fetch(`/api/user/${friend._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.session.token}`
            },
            body: JSON.stringify({
                update: {
                    $push: {
                        incomingFriendRequests: user._id
                    }
                }
            })
        });

        const res3 = await fetch(`/api/notification/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.session.token}`
            },
            body: JSON.stringify({
                initiator: user._id,
                receiver: friend._id,
                type: 6,
                buttonHREF: `/friends`
            })
        });

        setLoading(false);
        setSuccess(true);
        if (!res.ok) {
            setError("Failed to add friend");
            return;
        }

        setUser({...user, outgoingFriendRequests: [...user.outgoingFriendRequests, friend._id]});
        setOutgoingFriendRequests((outgoing: User[]) => (
            [...outgoing, friend]
        ));
        onOpenChange(false);
    }


    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent className="p-4 flex flex-col gap-2">
                <h1 className="text-lg font-bold">Add Friend</h1>
                <Input type="email" value={email} onValueChange={setEmail} placeholder="Enter Email" endContent={<Button className="bg-transparent" isIconOnly><CheckIcon onClick={addFriend} className="h-5 w-5 text-green-500 hover:text-green-400"/></Button>}/>


                {friend && <>
                    <div className="flex flex-row items-center gap-4 justify-between">
                        <p> Is this who you were looking for?</p>
                        <Button isLoading={loading} onClick={confirmFriend} className="bg-transparent" variant="light" color="success">
                            Add Friend
                        </Button>
                    </div>

                    <div className="border rounded-xl dark:border-gray-800">
                    <UserCard user={friend}/>
                    </div>


</>}
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">Successfully added friend!!</p>}
            </ModalContent>
        </Modal>
    )
}