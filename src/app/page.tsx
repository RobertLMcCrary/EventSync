// "use client";
// import Image from "next/image";
// import {Meetup, defaultMeetup, User, defaultUser} from "@/types";
// import MeetupCard from "@/app/components/meetupCard";



// export default function Home() {
//   // TODO: Create a home page


//     return (
//      <div>
//          <p>Event sync [todo] </p>
//          <p>User Profile</p>
//      </div>
//     );

// }
// TODO: Completed Friends Page
"use client";
import Sidebar from "@/app/components/sidebar";
import {defaultUser} from "@/types";

export default function Friends() {
  return (
      <div className="flex flex-row bg-neutral-100 dark:bg-black h-screen w-screen">
          <Sidebar user={defaultUser} active="friends"/>
      </div>
  )
}