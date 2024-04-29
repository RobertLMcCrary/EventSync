import { UserGroupIcon, ClockIcon, CalendarIcon } from "@heroicons/react/20/solid";
import { Meetup, User } from "@/types";
import {Button, Avatar, Skeleton, Image, CardHeader} from "@nextui-org/react";
import {Card, CardBody, CardFooter} from "@nextui-org/react";
import {useRouter} from "next13-progressbar";


export default function MeetupCard({ meetup, creator, small }: { meetup: Meetup | null, creator: User | null, small: boolean}){

    const startTime = meetup? new Date(meetup.date).toLocaleTimeString() : '';
    const startDate = meetup? new Date(meetup.date).toLocaleDateString() : '';
    const router = useRouter();



    if (small){
        return (
             !meetup ? <Skeleton className="w-full aspect-square rounded-lg"/> :

                <Card className="w-full aspect-square rounded-xl">
                    <div className="overflow-hidden">
                        <CardHeader
                            className="absolute bg-white/30 rounded-t-lg z-10 backdrop-blur w-full dark:bg-black/30 flex-col items-start">
                            <p className="text-base text-black/30 dark:text-white/60 uppercase font-bold">{meetup?.title}</p>
                            <h4 className="dark:text-stone-100/50 text-stone-800/50 font-medium text-tiny">{meetup?.description}
                                <span
                                    className="font-bold ml-4">{new Date(meetup.date.toLocaleString()).toLocaleString()}</span>
                            </h4>
                        </CardHeader>
                    </div>
                    <Image
                        removeWrapper
                        alt={meetup?.title}
                        className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
                        src={meetup?.image}
                    />
                    <div className="overflow-hidden ">
                        <CardFooter
                            className="absolute rounded-none backdrop-blur w-full bg-white/50 dark:bg-black/50 bottom-0 z-10 justify-between">
                            <div>
                                <div className="flex flex-row items-center">
                                    <Avatar src={creator?.avatar} isBordered size="sm" className="w-5 h-5 mr-2 "/>
                                    <p className="text-tiny dark:text-white/70 text-stone-800/70 font-bold ml-1">{creator?.username}</p>
                                </div>
                            </div>
                            <Button onClick={() => router.push('/meetups/' + meetup?._id)} className="text-tiny"
                                    color="primary" radius="full" size="sm">
                                View
                            </Button>
                        </CardFooter>
                    </div>
                </Card>

        )
    }

    return (
        <Card className="max-w-600px mb-4 overflow-visible">
            <CardBody>
                <div className="flex flex-row space-x-4">
                    <Skeleton isLoaded={!!meetup} className="rounded-lg">
                        <Image src={meetup?.image} alt="Meetup Image" width={130} height={130} className=" rounded-lg aspect-square" />
                    </Skeleton>

                    <div className="flex flex-col w-full justify-between">
                        <div className="flex flex-col"><div className="flex flex-row w-full justify-between">
                            <div className="flex flex-col w-full">
                                <Skeleton isLoaded={!!meetup} className={!meetup ? "rounded-md w-3/5 h-4 mb-1" : ""}>
                                    <p className="text-base w-full font-semibold">{meetup?.title}</p>
                                </Skeleton>

                                <Skeleton isLoaded={!!meetup} className={!meetup ? "rounded-md w-4/5 h-4" : ""}>
                                    <p className="text-xs w-full dark:text-gray-400">{meetup?.description}</p>
                                </Skeleton>
                            </div>

                            <Skeleton isLoaded={!!creator} className={!creator? "w-6 h-6 rounded-full" : ""}></Skeleton>
                            {creator ?<Avatar isBordered radius="full" src={creator.avatar} className="w-6 h-6 text-tiny"  /> : null}
                        </div>

                        </div>
                        { meetup ?
                        <div className="flex flex-row w-full justify-end">

                            <Button color="primary" variant="flat" className="mr-2">
                                <p>Edit</p>
                            </Button>
                            <Button color="primary" onClick={() => router.push('/meetups/'+meetup._id)}>
                                <p>View</p>
                            </Button>

                        </div>
                            :
                        <div className="w-full"><Skeleton className="w-full h-5 mt-4 rounded-md"/>
                            <Skeleton className="w-full h-5 mt-1 rounded-md"/>
                        </div>}


                    </div>
                </div>
            </CardBody>
        </Card>

    );
}

