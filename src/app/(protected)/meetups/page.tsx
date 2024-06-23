// TODO: Create a page for meetups
"use client";

import {sessionContext, useUser, expiredContext, globalErrorContext} from "@/app/providers";
import {useContext, useEffect, useState} from "react";
import MeetupCard from "@/app/components/meetupCard";

import {Meetup} from "@/types";
import {MagnifyingGlassIcon} from "@heroicons/react/24/solid";
import {Input} from "@nextui-org/react";

export default function Meetups() {
  const {user, updateUser} = useUser();
  const { session, status } = useContext(sessionContext);
  const [meetups, setMeetups] = useState<(Meetup | null)[]>([null, null, null, null]);
  const { setExpired } = useContext(expiredContext);
  const [meetupsSearch, setMeetupsSearch] = useState("");
  const [visibleMeetups, setVisibleMeetups] = useState(meetups);
  const { setGlobalError } = useContext(globalErrorContext);

  useEffect(() => {
    if (user && meetups.includes(null)) {
      const fetchPromises = user.meetups.map(async (meetupID: string) => {
        const res = await fetch(`/api/meetup/${meetupID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.token}`
          }
        });
        const data = await res.json();
        if (!res.ok) {
          if (data.error == "Not Authorized") {
            setExpired(true);
          } else {
            setGlobalError(data.error);
          }
          return {error: data.error};
        }
        return data;
      });

      Promise.all(fetchPromises).then((meetupsData) => {
        const validMeetups = meetupsData.filter(meetup => !('error' in meetup));
        setMeetups(validMeetups);
        setVisibleMeetups(validMeetups);
      });
    }
    }, [meetups, session.token, setExpired, setGlobalError, user]);

  useEffect(() => {
    if (meetupsSearch === "") {
      setVisibleMeetups(meetups);
    } else {
      setVisibleMeetups(meetups.filter((meetup) => meetup?.title.toLowerCase().includes(meetupsSearch.toLowerCase())));
    }
  }, [meetupsSearch, meetups]);

  return (
      <>
      <Input
          placeholder="Search"
          value={meetupsSearch}
          className="fixed z-50 top-5 dark:bg-neutral-900/50 right-8 w-64"
          onChange={(e) => setMeetupsSearch(e.target.value)}
          startContent={<MagnifyingGlassIcon width={20} height={20}/>}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4 gap-4 overflow-y-scroll h-screen auto-rows-min">
        {visibleMeetups.toReversed().map((meetup, i) => (
            <div className="" key={i}>
              <MeetupCard meetup={meetup} creator={user} small={true} key={i} />
            </div>
        ))}
      </div>
</>
  )
}