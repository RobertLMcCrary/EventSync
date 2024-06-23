// TODO: Complete the UserProfile component
"use client";
import { useUser } from "@/app/providers";
import useSession from "@/app/components/utils/sessionProvider";
import { useState } from "react";
import { Button, Avatar, Badge, user } from "@nextui-org/react";
import { User } from "@/types";
import ClockIcon from "@heroicons/react/24/solid/ClockIcon";
import MeetupCard from "@/app/components/meetupCard";

export default function UserProfile({ params }: { params: { id: string } }) {


  return (
    <div className="w-full h-[calc(100vh-80px)] flex flex-col">
      <div className="w-full">
        <div className="flex flex-col w-full">
          <div className="flex flex-row p-4 border-b dark:border-stone-800 items-center">
            <div className=" h-24 w-24 sm:w-64 sm:h-64 ">
              <Avatar
                src={
                  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Oryctolagus_cuniculus_Rcdo.jpg/1200px-Oryctolagus_cuniculus_Rcdo.jpg"
                }
                size="lg"
                className="h-24 w-24 sm:w-64 sm:h-64"
                isBordered
              />
            </div>
            <div className="flex flex-col w-full ml-8 items-start justify-start justify-items-start">
              <div className="flex flex-row items-center">
                <p className="text-5xl font-bold ">{"username"}</p>
              </div>
              <div className="flex flex-row items-center mb-2">
                <p className="text-xl dark:text-stone-400 text-stone-600 font-semibold ">
                  {"email@mail.com"}
                </p>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col p-4">
            <div className="items-center mt-2">
              <h1 className="text-lg dark:text-stone-400 text-stone-600 font-semibold">
                Bio
              </h1>
              <p className="text-xl font-semibold ">
                {
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
                }
              </p>
            </div>

            <div className="mt-4 w-full inline-block">
              <h1 className="text-lg dark:text-stone-400 text-stone-600 font-semibold ">
                Interests
              </h1>
              <div className="m-1 ml-0 w-fit p-2 px-4 rounded-xl dark:border-stone-800 border dark:bg-stone-950 inline-flex flex-row justify-between items-center">
                <p className="font-semibold text-base">interest 1</p>
              </div>
              <div className="m-1 w-fit p-2 px-4 rounded-xl dark:border-stone-800 border dark:bg-stone-950 inline-flex flex-row justify-between items-center">
                <p className="font-semibold text-base">interest 2</p>
              </div>
              <div className="m-1 w-fit p-2 px-4 rounded-xl dark:border-stone-800 border dark:bg-stone-950 inline-flex flex-row justify-between items-center">
                <p className="font-semibold text-base">interest 3</p>
              </div>
            </div>

            <div className="mt-4 w-full inline-block">
              <h1 className="text-lg dark:text-stone-400 text-stone-600 font-semibold ">
                Upcoming meetups
              </h1>
              <div className="flex flex-wrap p-4 gap-4 overflow-y-scroll h-full">

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
