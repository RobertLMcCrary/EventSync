"use client";
import useSession from "@/app/components/utils/sessionProvider";
import {useEffect, useState} from "react";
import {useUser} from "@/app/providers";
import { Meetup, User} from "@/types";
import {Button, Skeleton} from "@nextui-org/react";
import { useRouter } from 'next13-progressbar';
import { Avatar } from "@nextui-org/react";

export default function MeetupInvite({ params }: { params: { token: string } }){
    const {user, updateUser} = useUser();
    const session = useSession();
    const [tokenData, setTokenData] = useState<any>(null);
    const [inviteError, setInviteError] = useState<string>("");
    const [meetup, setMeetup] = useState<Meetup | null>(null);
    const [meetupCreator, setMeetupCreator] = useState<User | null>(null);
    const [loadingData, setLoadingData] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        if (!tokenData && !inviteError) {
            fetch('/api/auth/verify', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${params.token}`
                }
            }).then((res) => {
                if (!res.ok){
                    setInviteError("Invitation is invalid or expired");
                    return;
                }
                res.json().then((tokenData) => {
                    setTokenData(tokenData);
                })
            })
        }
        if (session.status == "done" && tokenData && loadingData && user) {
            setLoadingData(false);

            if ("error" in tokenData || tokenData.type != "meetup-invitation") {
                setInviteError("Invitation is invalid or expired");
            } else if (!tokenData.userID.includes('@') && tokenData.userID != session.session.userID) {
                setInviteError("This invitation is not for you");
            } else {
                if (tokenData.userID.includes('@') && tokenData.userID != user.email){
                    setInviteError("This invitation is not for you");
                    return;
                }
                fetch(`/api/meetup/${tokenData.meetup}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.session.token}`
                    }
                }).then((data) => {
                    data.json().then((meetup) => {
                        if (meetup.attendees.includes(session.session.userID) || meetup.unavailable.includes(session.session.userID)){
                            setInviteError("You already accepted this invitation");
                            return;
                        }
                        if (!meetup.invited.includes(session.session.userID) && !meetup.unavailable.includes(session.session.userID) && !meetup.attendees.includes(session.session.userID)) {
                            setInviteError("You already responded to this invitation");
                            return;
                        }
                        setMeetup(meetup);
                        fetch(`/api/user/${meetup.creator}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${session.session.token}`
                            }
                        }).then((data) => {
                            data.json().then((user) => {
                                setMeetupCreator(user);
                            })
                        })
                    })
                });
            }
        }
    }, [user, loadingData, params.token, router, session.session.token, session.session.userID, session.status, setTokenData, tokenData, inviteError]);


    function acceptInvite(){
        if (!meetup) return;
        const meetupUpdate = fetch(`/api/meetup/${meetup._id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.session.token}`
            },
            body: JSON.stringify({
                $push: {
                    attendees: session.session.userID
                },
                $pull: {
                    invited: session.session.userID
                }
            })
        });
        const userUpdate = fetch(`/api/user/${session.session.userID}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.session.token}`
            },
            body: JSON.stringify({
                update: {
                    $push: {
                        meetups: meetup._id
                    }
                }
            })
        });

        const notificationCreate = fetch(`/api/notification/create`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.session.token}`
            },
            body: JSON.stringify({
                initiator: session.session.userID,
                receiver: meetup.creator,
                meetup: meetup._id,
                buttonHREF: `/meetups/${meetup._id}`,
                type: 2
            })
        });

        Promise.all([meetupUpdate, notificationCreate, userUpdate]).then(() => {
            // update user context
            updateUser().then(() => {
                router.push(`/meetups/${meetup._id}`);
            });
        })
    }

    function rejectInvite() {
        if (!meetup) return;
        const meetupUpdate = fetch(`/api/meetup/${meetup._id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                $pull: {
                    invited: session.session.userID
                }
            })
        });

        const notificationCreate = fetch(`/api/notification/create`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.session.token}`
            },
            body: JSON.stringify({
                initiator: session.session.userID,
                receiver: meetup.creator,
                meetup: meetup._id,
                type: 3,
                buttonHREF: `/meetups/${meetup._id}`
            })
        });

        Promise.all([meetupUpdate, notificationCreate]).then(() => {
            router.push(`/dashboard`);
        })
    }



    return (
                <div className="flex justify-center items-center h-full w-full">
                    <div className="flex flex-col rounded-md w-96 h-auto p-4">
                        { meetup && meetupCreator ? <><h1 className="text-lg text-center flex flex-row items-center w-full justify-center">
                            <Avatar src={meetupCreator ? meetupCreator.avatar : ""} size="sm" isBordered className="mr-2 h-4 w-4"/>
                            <span className="font-bold text-stone-300 text-center text-md mr-1.5">{meetupCreator ? meetupCreator.username : ""}</span>
                          invited you to </h1>
                        <span className="font-bold text-center text-xl">{meetup ? meetup.title : ""}</span>
                        <p className="text-center text-sm dark:text-stone-400">{meetup? meetup.description : ""}</p>


                        <Button className="mb-2 mt-4 hover:bg-green-400" color="success" onClick={acceptInvite}>Accept</Button>
                        <Button color="danger" className="hover:bg-red-400" onClick={rejectInvite}>Decline</Button></> : null}
                        { inviteError ? <><p className="font-bold text-center mt-4 text-xl">Sorry!</p><p className="text-lg text-center">{inviteError}</p></> : null}
                        { !meetup && !inviteError ?
                            <><div className="flex flex-col w-full justify-center h-auto p-4">
                                <Skeleton className="w-2/3 rounded-md mb-1 h-6"/>
                                <Skeleton className="w-full rounded-md mb-1 h-6"/>
                                <Skeleton className="w-2/3 rounded-md mb-4 h-6"/>
                                <Skeleton className="w-full rounded-md mb-1 h-8"/>
                                <Skeleton className="w-full rounded-md mb-1 h-8"/>
                            </div></>
                            : null}
                    </div>
                </div>
    )
}