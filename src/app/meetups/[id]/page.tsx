// TODO: Complete the MeetupProfile component
"use client";
import Sidebar from "@/app/components/sidebar";
import { Card, CardBody } from "@nextui-org/card";
import {
  ClockIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PaperAirplaneIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import { useRouter } from "next13-progressbar";
import { Meetup, User, defaultUser } from "@/types";
import { useEffect, useState } from "react";
import useUserTheme from "@/app/components/utils/theme/updateTheme";
import useSession from "@/app/components/utils/sessionProvider";

export default function MeetupProfile({ params }: { params: { id: string } }) {
  let [userTheme, setUserTheme] = useUserTheme();
  let [user, setUser] = useState<User | null>(null);
  let [meetup, setMeetup] = useState<Meetup | null>(null);
  let [loadingUser, setLoadingUser] = useState(true);

  let [newAnnouncementVis, setNewAnnouncementVis] = useState(false);
  let [searchAnnouncementsVis, setSearchAnnouncementsVis] = useState(false);
  let [announcementInput, setAnnouncementInput] = useState("");
  let [searchInput, setSearchInput] = useState("");

  const router = useRouter();

  // Get TOKEN from cookie
  const { session, status } = useSession();

  useEffect(() => {
    if (status == "done" && loadingUser) {
      setLoadingUser(false);
      fetch(`/api/user/${session.userID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
      }).then((data) => {
        data.json().then((user) => {
          setUser(user);
        });
      });

      fetch(`/api/meetup/` + params.id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
      }).then((data) => {
        data.json().then((meetup) => {
          setMeetup(meetup);
        });
      });
    } else if (status == "error") {
      if (typeof window !== "undefined") {
        router.push("/login");
      }
    }
  });

  return (
    <div className="flex flex-row bg-gray-100 dark:bg-black h-screen w-screen">
      <Sidebar user={defaultUser} active="meetups" />
      <div className="flex items-center justify-center align-middle h-screen w-full p-4 md:p-8">
        <Card className="w-full h-full">
          <CardBody className="md:overflow-hidden p-0">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/0c/GoldenGateBridge-001.jpg"
              className="border-b-[1.5px] border-gray-500 w-full h-1/4 object-cover rounded-t-xl"
            />
            <div className="relative p-8 md:p-14">
              <Button
                color="primary"
                variant="flat"
                isDisabled={false}
                className="absolute top-8 md:top-14 right-8 md:right-14"
                onClick={() => {
                  router.push("/meetups/" + params.id + "/edit");
                }}
              >
                Edit
              </Button>
              <div className="md:flex items-center mb-1">
                <h1 className="text-2xl font-semibold mr-4">
                  {meetup ? meetup.title : "Event name unavailable"}
                </h1>
                <div className="flex items-center">
                  <img
                    src="https://cdn.download.ams.birds.cornell.edu/api/v1/asset/612763581/1800"
                    className="border-[1.5px] border-gray-500 w-6 h-6 object-cover rounded-full mr-1"
                  />
                  <span className="text-sm">[creator]</span>
                </div>
              </div>
              <h2 className="pr-32">
                [description] Lorem ipsum dolor sit amet, consectetur adipiscing
                elit. Praesent consequat leo id dui malesuada, ut pharetra erat
                congue. Maecenas malesuada augue a justo tincidunt molestie.
                Donec quis tincidunt lorem. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Proin porttitor scelerisque
                aliquam. Fusce consectetur lao.
              </h2>
              <div className="md:flex md:gap-4 mt-6">
                <div className="flex-1">
                  <div>
                    <div className="flex">
                      <ClockIcon className="block w-6 h-6 text-gray-500 hover:text-gray-400 mr-1 transition-all" />
                      <h2>July 12th, 2029</h2>
                    </div>
                    <div className="flex mt-1">
                      <MapPinIcon className="block w-6 h-6 text-gray-500 hover:text-gray-400 mr-1 transition-all" />
                      <h2>Golden Gate Park</h2>
                    </div>
                  </div>
                  <div className="mt-6">
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
                  <div className="flex gap-2 mt-12">
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
                <div className="bg-gray-100 p-4 rounded-md flex-1 mt-12 md:mt-0">
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
                        <PlusIcon className="block w-6 h-6 text-gray-500 hover:text-gray-400 mr-1 transition-all" />
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
                        <MagnifyingGlassIcon className="block w-6 h-6 text-gray-500 hover:text-gray-400 mr-1 transition-all" />
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
                        <PaperAirplaneIcon className="block w-6 h-6 text-gray-500 hover:text-gray-400 mr-1 transition-all" />
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
                        <XMarkIcon className="block w-6 h-6 text-gray-500 hover:text-gray-400 mr-1 transition-all" />
                      </button>
                    </div>
                    <div className="md:overflow-y-scroll md:h-[15rem] lg:h-[17rem]">
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
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
