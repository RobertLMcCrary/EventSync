"use client";
import {User} from "@/types";
import {Breadcrumbs, BreadcrumbItem} from "@nextui-org/react";
import React, {useContext, useState} from "react";
import CreateMeetupStep1 from "@/app/components/create-meetup/createMeetupStep1";
import CreateMeetupStep2 from "@/app/components/create-meetup/createMeetupStep2";
import CreateMeetupStep3 from "@/app/components/create-meetup/createMeetupStep3";
import {useRouter} from "next13-progressbar";
import {useUser, sessionContext} from "@/app/providers";
import {now, getLocalTimeZone} from '@internationalized/date';

export default function CreateMeetup() {
    const {user, updateUser} = useUser();
    const [step, setStep] = useState(1);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [dateTime, setDateTime] = useState(now(getLocalTimeZone()));
    const [location, setLocation] = useState("");
    const [attendees, setAttendees] = useState<User[]>([]);
    const loadingUserObj = new User({
        _id: "loading",
        username: "",
        email: "",
        password: ""
    });
    const [friends, setFriends] = useState<(User)[]>([loadingUserObj]);
    const [userEmail, setUserEmail] = useState("");
    const [meetupCreationLoading, setMeetupCreationLoading] = useState<0 | 1 | 2>(0); // 0 = not started, 1 = loading, 2 = done
    const session = useContext(sessionContext);
    const router = useRouter();


    function createMeetup() {
        setMeetupCreationLoading(1)
        if (user?.googleAccount && user.googleAccount.scope.includes("https://www.googleapis.com/auth/calendar.events")) {
            fetch(process.env.NEXT_PUBLIC_GOOGLE_URL + '/google/createEvent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tokens: user.googleAccount,
                    userID: user._id,
                    meetup: {
                        title: name,
                        description: description,
                        date: dateTime.toDate(),
                        location: location,
                        invited: attendees.map((user) => user.email)
                    }
                })
            }).then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .catch(error => console.error('Error:', error));
        }
        fetch('/api/meetup/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.session.token}`
            },
            body: JSON.stringify({
                title: name,
                description: description,
                date: dateTime.toDate(),
                location: location,
                creator: session.session.userID,
                invited: attendees.map((user) => user._id)
            })
        }).then((data) => {
            data.json().then((meetup) => {
                setMeetupCreationLoading(2);
                updateUser();
                router.push(`/meetups/${meetup._id}`)
            })
        });
    }

    if (user && !userEmail) {
        setUserEmail(user.email);

        if (user.friends.length == 0) {
            const defaultFriendsUser = new User({
                _id: "0",
                username: "",
                email: "",
                password: ""
            })
            setFriends([
                defaultFriendsUser
            ])
            return;
        }
        const friendPromises = user.friends.map(async (friendID: string) => {
            const res = await fetch(`/api/user/${friendID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.session.token}`
                }
            });
            return await res.json();
        });

        Promise.all(friendPromises).then((friendsList) => {
            setFriends(friendsList);
        });
    }

    function changeStep(){
        setStep((step: number) => step + 1);
    }

    return (
        <div className=" flex justify-center items-center h-full w-full">
            <Breadcrumbs className="top-7 right-5 absolute">
                {step > 0 ? <BreadcrumbItem className="text-sm" onClick={()=>setStep(1)}>Name & Description</BreadcrumbItem> : null}
                { step > 1 ? <BreadcrumbItem onClick={()=>setStep(2)}>Location & Time</BreadcrumbItem> : null}
                { step > 2 ? <BreadcrumbItem onClick={()=>setStep(2)}>Attendees</BreadcrumbItem> : null}
            </Breadcrumbs>
            {step == 1 ? <CreateMeetupStep1 name={name} description={description} setName={setName} setDescription={setDescription} changeStep={changeStep}/> : null}
            {step == 2 ? <CreateMeetupStep2 location={location} dateTime={dateTime} changeStep={changeStep} setLocation={setLocation} setDateTime={setDateTime}/> : null}
            {step == 3 ? <CreateMeetupStep3 attendees={attendees} createMeetup={createMeetup} meetupCreationLoading={meetupCreationLoading} userEmail={userEmail} setAttendees={setAttendees} friends={friends}/> : null}
        </div>
    )
}