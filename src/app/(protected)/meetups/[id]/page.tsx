// TODO: Complete the MeetupProfile component
"use client";
import {Card, CardBody, Skeleton, Avatar, AvatarGroup} from "@nextui-org/react";
import {
    ClockIcon,
    MagnifyingGlassIcon,
    MapPinIcon,
    PaperAirplaneIcon,
    PlusIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import {useRouter} from "next13-progressbar";
import {Meetup, User} from "@/types";
import {useEffect, useState} from "react";
import {useContext} from "react";
import {useUser, sessionContext} from "@/app/providers";
import formatAttendeesString from "@/app/(protected)/meetups/formatAttendeesString";
import formatMemberString from "@/app/(protected)/meetups/formatMemberString";

export default function MeetupProfile({params}: { params: { id: string } }) {
    const {user, updateUser} = useUser();
    let [meetup, setMeetup] = useState<Meetup | null>(null);
    let [newAnnouncementVis, setNewAnnouncementVis] = useState(false);
    let [searchAnnouncementsVis, setSearchAnnouncementsVis] = useState(false);
    let [announcementInput, setAnnouncementInput] = useState("");
    let [searchInput, setSearchInput] = useState("");
    let [meetupCreator, setMeetupCreator] = useState<User | null>(null);
    let [meetupAttendees, setMeetupAttendees] = useState<User[]>([]);
    let [meetupUnavailable, setMeetupUnavailable] = useState<User[]>([]);
    let [meetupUndecided, setMeetupUndecided] = useState<User[]>([]);
    const [availability, setAvailability] = useState<0 | 1 | 2 | 3>(0);
    const router = useRouter();
    const [loadingData, setLoadingData] = useState<boolean>(true);


    // Get TOKEN from cookie
    const {session, status} = useContext(sessionContext);

    useEffect(() => {
        if (status == "done" && user && loadingData) {
            setLoadingData(false);
            fetch(`/api/meetup/` + params.id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.token}`,
                },
            }).then((data) => {
                data.json().then((meetupData) => {
                    setMeetup(meetupData);
                    if (user._id == meetupData.creator) {
                        setMeetupCreator(user);
                        setAvailability(3);
                    } else if (meetupData.attendees.includes(user._id)) {
                        setAvailability(1)
                    } else if (meetupData.unavailable.includes(user._id)) {
                        setAvailability(2)
                    } else {
                        setAvailability(0);
                    }
                    if (meetupData.creator != user._id) {
                        fetch(`/api/user/` + meetupData.creator, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${session.token}`,
                            }
                        }).then((data) => {
                            data.json().then((userData) => {
                                setMeetupCreator(userData);
                                setMeetupAttendees((prev) => [...prev, userData]);
                            });
                        });
                    }
                })
            });
        }

            if (meetup && meetup.attendees.length > 0 && meetupAttendees.length != meetup.attendees.length) {
                const attendeesPromise = Promise.all(meetup.attendees.map(async (attendee: string) => {
                    const attendeeData = await fetch(`/api/user/` + attendee, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${session.token}`,
                        }
                    });
                    return await attendeeData.json();
                }));

                attendeesPromise.then((data) => {
                    setMeetupAttendees(data);
                });
            }

            if (meetup && meetup.unavailable.length > 0 && meetupUnavailable.length != meetup.unavailable.length) {
                const unavailablePromise = Promise.all(meetup.unavailable.map(async (attendee: string) => {
                    const unavailableData = await fetch(`/api/user/` + attendee, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${session.token}`,
                        }
                    });
                    return await unavailableData.json();
                }));

                unavailablePromise.then((data) => {
                    setMeetupUnavailable(data);
                });
            }

            if (meetup && meetup.invited.length > 0 && meetupUndecided.length != meetup.invited.length) {

                const undecidedPromise = Promise.all(meetup.invited.map(async (attendee: string) => {
                    if (attendee.includes('@')) {
                        return;
                    }
                    const undecidedData = await fetch(`/api/user/` + attendee, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${session.token}`,
                        }
                    });

                    return await undecidedData.json();
                }));

                undecidedPromise.then((data) => {
                    setMeetupUndecided(data);
                });
            }
    }, [loadingData, meetup, meetupAttendees.length, meetupCreator, meetupUnavailable.length, meetupUndecided.length, params.id, router, session.token, status, user]);

    const attendeeData = formatAttendeesString(meetupAttendees, user);
    const undecidedData = formatMemberString(meetupUndecided);
    const unavailableData = formatMemberString(meetupUnavailable);

    return (
        <div className="flex items-center h-[calc(100vh-80px)] justify-center align-middle  p-4 md:p-8">
            <Card className="w-full h-full">
                <CardBody className="md:overflow-hidden p-0 w-full h-full ">
                    {meetup?
                        <img
                            src={meetup.image}
                            alt={meetup.title}
                            className=" w-full h-1/4 object-cover rounded-t-xl"
                        /> : null
                    }

                    <div className="flex flex-col md:flex-row md:gap-4 p-8 flex-grow">
                        <div className="flex-1 h-full md:w-1/2  w-full md:justify-between flex flex-col">
                            <div className="md:flex items-center justify-between flex-row mb-1">
                            <div className="flex flex-row">
                                {meetup ?
                                    <h1 className="text-2xl font-semibold mr-4 ">
                                        {meetup.title}
                                    </h1>
                                    : <Skeleton className="w-[3/5] h-5 rounded-md"/>
                                }

                                {meetupCreator ? <div className="flex flex-row items-center">
                                        <Avatar
                                            src={meetupCreator.avatar}
                                            className="border-[1.5px] border-gray-500 w-6 h-6 object-cover rounded-full mr-1"
                                        />
                                        <span className="text-sm font-semibold test-stone-800">{meetupCreator.username}</span>
                                    </div>
                                    : <div className="flex flex-row items-center">
                                        <Skeleton className="w-6 h-6 mr-4 rounded-full"/>
                                        <Skeleton className="w-20 h-4 rounded-lg"/>
                                    </div>
                                }
                            </div>
                        </div>

                                {meetup ? <p>{meetup.description}</p> : <Skeleton className="w-[4/5] h-4 rounded-lg"/>}

                            <div>
                            <div className="mt-6 w-full">
                                <div className="flex">
                                    <ClockIcon
                                        className="block w-6 h-6 text-gray-500 hover:text-gray-400 mr-1 transition-all"/>
                                    <h2>July 12th, 2029</h2>
                                </div>
                                <div className="flex mt-1 w-full">
                                    <MapPinIcon
                                        className="block w-6 h-6 text-gray-500 hover:text-gray-400 mr-1 transition-all"/>
                                    {meetup? <a className="text-blue-500 hover:text-blue-600 hover:text-underline" href={"https://google.com/maps?q="+meetup.location}>{meetup.location}</a> : <Skeleton className="w-[4/5] h-4 rounded-lg"/>}
                                </div>
                            </div>
                            <div className="my-6">
                                <div className="flex flex-row items-center mb-1">
                                    <AvatarGroup isBordered className="flex mb-2 mt-4 mr-2">
                                        {attendeeData == null ? <Skeleton/> : attendeeData.attendeeAvatars.map((avatar, index) => (
                                            <Avatar
                                                src={avatar}
                                                key={index}
                                                alt="avatar"
                                            />
                                        ))}
                                    </AvatarGroup>
                                    <span className="ml-4 mt-2 ">
                                        {attendeeData == null ? <Skeleton/> : attendeeData.attendeesShow}
                                        <span className={(attendeeData == null ? "hidden" : "inline-block") + " ml-1 font-semibold"}>coming</span>
                      </span>
                                </div>
                                <div className="flex mb-1">
                                    <AvatarGroup max={3} isBordered className="flex mb-2 mr-2">
                                        {attendeeData == null ? <Skeleton/> : unavailableData.invitedAvatars.map((avatar, index) => (
                                            <Avatar
                                                src={avatar}
                                                key={index}
                                                alt="avatar"
                                            />
                                        ))}
                                    </AvatarGroup>
                                    <span className={(unavailableData?.invitedAvatars.length > 0 ? "ml-4" : "") + " mt-2 "}>
                                        {unavailableData == null ? <Skeleton/> : unavailableData.invitedShow}
                                        <span className={(unavailableData == null ? "hidden" : "inline-block") + " ml-1 font-semibold"}>not coming</span>

                      </span>
                                </div>


                                <div className="flex flex-row items-center mb-1">
                                    <AvatarGroup isBordered className="flex mb-2 mt-4 mr-2">
                                        {unavailableData == null ? <Skeleton/> : undecidedData.invitedAvatars.map((avatar, index) => (
                                            <Avatar
                                                src={avatar}
                                                key={index}
                                                alt="avatar"
                                            />
                                        ))}
                                    </AvatarGroup>


                                    <span className={(undecidedData?.invitedAvatars.length > 0 ? "ml-4" : "") + " mt-2 "}>
                                        {undecidedData == null ? <Skeleton/> : undecidedData.invitedShow}
                                        <span className={(undecidedData == null ? "hidden" : "inline-block") + " ml-1 font-semibold"}>undecided</span>
                      </span>

                                </div>
                            </div>
                            </div>

                        </div>
                        <div className="bg-stone-100 dark:bg-stone-950 p-4 h-1/2 rounded-xl overflow-y-scroll flex-1 w-full  md:w-1/2  md:mt-2 md:h-[calc(100%-32px)]">
                            <div className="flex w-full border-b border-gray-300 dark:border-gray-700 pb-3 mb-3">
                                <h1 className="text-lg font-semibold">Announcements</h1>
                                <div className="flex gap-1 ml-auto">
                                    <button
                                        onClick={() => {
                                            if (newAnnouncementVis) {
                                                setNewAnnouncementVis(false);
                                            } else {
                                                setNewAnnouncementVis(true);
                                                setSearchAnnouncementsVis(false);
                                            }
                                        }}
                                    >
                                        <PlusIcon
                                            className="block w-6 h-6 text-gray-500 hover:text-gray-400 mr-1 transition-all"/>
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (searchAnnouncementsVis) {
                                                setSearchAnnouncementsVis(false);
                                            } else {
                                                setSearchAnnouncementsVis(true);
                                                setNewAnnouncementVis(false);
                                            }
                                        }}
                                    >
                                        <MagnifyingGlassIcon
                                            className="block w-6 h-6 text-gray-500 hover:text-gray-400 mr-1 transition-all"/>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <div
                                    className={`${
                                        newAnnouncementVis ? "flex" : "hidden"
                                    } border-b border-gray-300 dark:border-gray-700 px-1 pb-3 mb-3`}
                                >
                                    <input
                                        placeholder="Enter new announcement..."
                                        className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3"
                                        value={announcementInput}
                                        onChange={(e) => setAnnouncementInput(e.target.value)}
                                    />
                                    <button
                                        className="ml-3"
                                        onClick={() => {
                                            console.log("Clicked 'Add announcement'!");
                                        }}
                                    >
                                        <PaperAirplaneIcon
                                            className="block w-6 h-6 text-gray-500 hover:text-gray-400 mr-1 transition-all"/>
                                    </button>
                                </div>
                                <div
                                    className={`${
                                        searchAnnouncementsVis ? "flex" : "hidden"
                                    } border-b border-gray-300 dark:border-gray-700 px-1 pb-3 mb-3`}
                                >
                                    <input
                                        placeholder="Search..."
                                        className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3"
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                    />
                                    <button
                                        className="ml-3"
                                        onClick={() => {
                                            console.log("Clicked 'Clear search'!");
                                            setSearchInput("");
                                        }}
                                    >
                                        <XMarkIcon
                                            className="block w-6 h-6 text-gray-500 hover:text-gray-400 mr-1 transition-all"/>
                                    </button>
                                </div>
                                <div className="md:overflow-y-scroll md:h-[15rem]">
                                    <div className="border-b border-gray-300 dark:border-gray-700 px-1 pb-3 mb-3">
                                        <div className="flex align-middle text-sm text-gray-700 mb-1">
                                            <img
                                                src="https://cdn.download.ams.birds.cornell.edu/api/v1/asset/612763581/1800"
                                                className="border-[1.5px] border-gray-500 w-5 h-5 object-cover rounded-full z-10 mr-1.5"
                                            />
                                            <span>[name]</span>
                                        </div>
                                        <p>
                                            auctor lectus eget pulvinar pellentesque. Suspendisse
                                            sollicitudin vulputate justo, ut venenatis metus
                                            posuere at. Duis tempor aliqua.
                                        </p>
                                    </div>
                                    <div className="border-b border-gray-300 dark:border-gray-700 px-1 pb-3 mb-3">
                                        <div className="flex align-middle text-sm text-gray-700 mb-1">
                                            <img
                                                src="https://cdn.download.ams.birds.cornell.edu/api/v1/asset/612763581/1800"
                                                className="border-[1.5px] border-gray-500 w-5 h-5 object-cover rounded-full z-10 mr-1.5"
                                            />
                                            <span>[name]</span>
                                        </div>
                                        <p>
                                            lputate justo, ut venenatis metus posuere at. Duis
                                            tempor aliquam nibh, elementum magna finibus quis.
                                            Proin cursus ultrices bibendum.
                                        </p>
                                    </div>
                                    <div className="border-b border-gray-300 dark:border-gray-700 px-1 pb-3 mb-3">
                                        <div className="flex align-middle text-sm text-gray-700 mb-1">
                                            <img
                                                src="https://cdn.download.ams.birds.cornell.edu/api/v1/asset/612763581/1800"
                                                className="border-[1.5px] border-gray-500 w-5 h-5 object-cover rounded-full z-10 mr-1.5"
                                            />
                                            <span>[name]</span>
                                        </div>
                                        <p>
                                            Quisque et malesuada dolor, porta aliquam dolor. In
                                            posuere, sapien at tristique aliquam, orci quam
                                            maximus ipsum, sed viverra eros elit ac eros. Donec
                                            pretium, est ut viv.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

</CardBody>
</Card>
</div>
)
    ;
}
