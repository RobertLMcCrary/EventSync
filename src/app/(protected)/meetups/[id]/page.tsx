// TODO: Complete the MeetupProfile component
"use client";
import {Card, CardBody, Button, Skeleton, Image, Avatar} from "@nextui-org/react";
import {
    ClockIcon,
    MagnifyingGlassIcon,
    MapPinIcon,
    PaperAirplaneIcon,
    PlusIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import {useRouter} from "next13-progressbar";
import {Meetup, User, defaultUser} from "@/types";
import {useEffect, useState} from "react";
import {useContext} from "react";
import {userContext} from "@/app/providers";
import useSession from "@/app/components/utils/sessionProvider";

export default function MeetupProfile({params}: { params: { id: string } }) {
    const {user, updateUser} = useContext(userContext);
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


    // Get TOKEN from cookie
    const {session, status} = useSession();

    useEffect(() => {
        if (status == "done" && user && !meetup) {
            fetch(`/api/meetup/` + params.id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.token}`,
                },
            }).then((data) => {
                data.json().then((meetupData) => {
                    console.log(meetupData)
                    setMeetup(meetupData);
                    if (user._id == meetupData.creator) {
                        setMeetupAttendees((prev) => [...prev, user]);
                        setMeetupCreator(user);
                        setAvailability(3);
                    } else if (meetupData.attendees.includes(user._id)) {
                        setMeetupAttendees((prev) => [...prev, user]);
                        setAvailability(1)
                    } else if (meetupData.unavailable.includes(user._id)) {
                        setMeetupUnavailable((prev) => [...prev, user]);
                        setAvailability(2)
                    } else {
                        setMeetupUndecided((prev) => [...prev, user]);
                        setAvailability(0);
                    }
                    if (!meetupCreator) {
                        fetch(`/api/user/` + meetupData.creator, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${session.token}`,
                            }
                        }).then((data) => {
                            data.json().then((userData) => {
                                setMeetupCreator(userData);
                            });
                        });
                    }
                });
            });
        } else if (status == "error") {
            if (typeof window !== "undefined") {
                router.push("/login");
            }
        }
    }, [meetup, meetupCreator, params.id, router, session.token, status, user]);

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
                        <div className="flex-1 h-full md:w-1/2 w-full md:justify-between flex flex-col">
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
                                    {meetup? <h2>{meetup.location}</h2> : <Skeleton className="w-[4/5] h-4 rounded-lg"/>}
                                </div>
                            </div>
                            <div className="my-6">
                                <div className="flex mb-1">
                                    <div className="flex -mr-1.5">
                                        <img
                                            src="https://cdn.download.ams.birds.cornell.edu/api/v1/asset/612763581/1800"
                                            className="border-[1.5px] border-gray-500 w-6 h-6 object-cover rounded-full z-10"
                                        />
                                        <img
                                            src="https://www.petlandtexas.com/wp-content/uploads/2016/08/Red_Bunny_Petland_Puppy.jpg"
                                            className="-translate-x-3 border-[1.5px] border-gray-500 w-6 h-6 object-cover rounded-full"
                                        />
                                    </div>
                                    <span>
                        {meetup ? meetup.creator : "Creator name unavailable"}{" "}
                                        and 4 others are{" "}
                                        <span className="font-semibold">coming</span>
                      </span>
                                </div>
                                <div className="flex mb-1">
                                    <div className="flex -mr-1.5">
                                        <img
                                            src="https://bestfriends.org/sites/default/files/2023-02/Victory3427MW_Social.jpg"
                                            className="border-[1.5px] border-gray-500 w-6 h-6 object-cover rounded-full z-10"
                                        />
                                        <img
                                            src="https://cdn.britannica.com/34/235834-050-C5843610/two-different-breeds-of-cats-side-by-side-outdoors-in-the-garden.jpg"
                                            className="-translate-x-3 border-[1.5px] border-gray-500 w-6 h-6 object-cover rounded-full"
                                        />
                                    </div>
                                    <span>
                        [name] and 2 others are{" "}
                                        <span className="font-semibold">not coming</span>
                      </span>
                                </div>
                                <div className="flex mb-1">
                                    <div className="flex -mr-1.5">
                                        <img
                                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwDb8nupIgI-CcUXjpWxenl2yDLFnXsul2ozPZN280Ew&s"
                                            className="border-[1.5px] border-gray-500 w-6 h-6 object-cover rounded-full z-10"
                                        />
                                        <img
                                            src="https://www.alleycat.org/wp-content/uploads/2019/03/FELV-cat.jpg"
                                            className="-translate-x-3 border-[1.5px] border-gray-500 w-6 h-6 object-cover rounded-full"
                                        />
                                    </div>
                                    <span>
                        [name] and [name] are{" "}
                                        <span className="font-semibold">undecided</span>
                      </span>
                                </div>
                            </div>
                            </div>
                            <div className="flex gap-2 mt-4 md:mt-0">
                                <Button
                                    color="primary"
                                    isDisabled={false}
                                    onClick={() => {
                                        console.log("clicked 'I'm coming'!");
                                    }}
                                >
                                    I&apos;m coming
                                </Button>
                                <Button
                                    color="primary"
                                    variant="ghost"
                                    isDisabled={false}
                                    onClick={() => {
                                        console.log("clicked 'I'm not coming'!");
                                    }}
                                >
                                    I&apos;m not coming
                                </Button>
                            </div>
                        </div>
                        <div className="bg-stone-100 dark:bg-stone-950 p-4 h-1/2 rounded-xl overflow-y-scroll flex-1 w-full  md:w-1/2  md:mt-2 md:h-full">
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
