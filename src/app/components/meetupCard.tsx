import { UserGroupIcon, ClockIcon, CalendarIcon } from "@heroicons/react/20/solid";
import { Meetup, User } from "@/types";
import {Button, Avatar, Skeleton, Image} from "@nextui-org/react";
import {Card, CardBody, CardFooter} from "@nextui-org/react";
import {useRouter} from "next13-progressbar";


export default function MeetupCard({ meetup, creator, small }: { meetup: Meetup | null, creator: User | null, small: boolean}){

    const startTime = meetup? new Date(meetup.date).toLocaleTimeString() : '';
    const startDate = meetup? new Date(meetup.date).toLocaleDateString() : '';
    const router = useRouter();

    if (small){
        return (
            <Card
                isFooterBlurred
                radius="lg"
                className="border-none w-full h-auto aspect-square"

            >
                <Image
                    className="object-cover w-full h-full aspect-square"
                    alt={meetup?.title}
                    src={meetup?.image}

                />
                <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny text-white/80">{meetup?.title}</p>
                    <Button onClick={()=>router.push(`/meetups/${meetup?._id}`)} className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                        View
                    </Button>
                </CardFooter>
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

