import {PublicEvent} from "@/types/Event";
import {Chip, Link} from "@nextui-org/react";
import {CalendarIcon} from "@heroicons/react/20/solid";
import {ClockIcon} from "@heroicons/react/24/solid";
import {MapIcon} from "@heroicons/react/24/outline";
import React from "react";


export function EventCard({event}: {event: PublicEvent}) {
    return (
        <div className="rounded-xl bg-white shadow-xl dark:bg-neutral-950 dark:border-none flex flex-col justify-between border p-4 border-gray-200">
            <Link href={event.url}>
                <h2 className="font-bold text-base">{event.title}</h2>
            </Link>
            <p>{event.venue.address}</p>
            <p>{event.stats.highest_price}</p>
            <p>{event.stats.lowest_price}</p>
            <p>{event.type}</p>
            <div className="flex flex-row mt-2 justify-between">
                <Chip
                    startContent={<CalendarIcon width={16} height={16}/>}
                    variant="faded"
                    color="success"
                >{new Date(event.datetime_utc).toLocaleDateString()}</Chip>
                <Chip
                    startContent={<ClockIcon width={16} height={16}/>}
                    variant="faded"
                    color="success"
                >{new Date(event.datetime_utc).toLocaleTimeString()}</Chip>
                <Chip
                    startContent={<MapIcon width={16} height={16}/>}
                    variant="faded"
                    color="success"
                >{event.venue.name}</Chip>
            </div>
        </div>
    );
}
