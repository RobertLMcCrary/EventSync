"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next13-progressbar"
import { useTheme } from "next-themes";

//AOS - animate on scroll library
import AOS from 'aos'
import 'aos/dist/aos.css';

//nextui
import {
    Navbar,
    NavbarContent,
    NavbarBrand,
    Button,
    Link,
    Card,
    CardHeader,
    CardBody,
    NavbarItem,
    Switch,
    NavbarMenu,
    NavbarMenuItem
} from "@nextui-org/react"
import NotificationCard from "@/app/components/notification";
import {defaultMeetup, defaultUser, defaultNotification, defaultNotification2} from "@/types";
import MeetupCard from "@/app/components/meetupCard";
import {UserCard} from "@/app/components/UserCard";



export default function Home() {
    const router = useRouter();

    //handling theme
    const { theme, setTheme } = useTheme()
    const currentTheme = theme

    const toggleTheme = () => {
        if (currentTheme == 'light') {
            setTheme('dark')
        }
        if (currentTheme == 'dark') {
            setTheme('light')
        }
    }

    //features demo section
    type Feature = {
        name: string,
        id: number,
        info: string,
        image: string
    }

    const features: Feature[] = [
        {
            id: 1,
            name: "Meetups",
            info: "Create memorable hangouts with friends effortlessly. Event Sync simplifies scheduling, location sharing, and attendee management for seamless gatherings.",
            image: "path/to/feature1-image.jpg",
        },
        {
            id: 2,
            name: "Notifications",
            info: "Stay connected and informed about hangout plans with real-time updates and reminders. Get alerts about upcoming events, changes, and messages from friends.",
            image: "path/to/feature2-image.jpg",
        },
        {
            id: 3,
            name: "Friends",
            info: "Connect effortlessly with friends and plan hangouts together. Manage your friends list, collaborate on event planning, and make every gathering memorable.",
            image: "path/to/feature3-image.jpg",
        },
    ];


    useEffect(() => {
        AOS.init()
        // setTheme('light')
    }, [])

    return (
        <div className="h-full w-screen ">
            <div className="">
            <Navbar maxWidth="full" className="h-20 bg-white/50 backdrop-blur dark:bg-black/50 drop-shadow-lg">
                <NavbarContent>
                    <NavbarContent justify="start">
                        <NavbarBrand>
                            {currentTheme === 'dark' ? (
                                <Image
                                    src="/sm-dark-logo.png"
                                    width={60}
                                    height={60}
                                    alt="Logo"
                                    className="max-h-20 px-[-10px] m-[-10px]"
                                />
                            ) : (
                                <Image
                                    src="/sm-logo.png"
                                    width={60}
                                    height={60}
                                    alt="Logo"
                                    className="max-h-20 px-[-10px] m-[-10px]"
                                />
                            )}
                            <h1>EventSync</h1>
                        </NavbarBrand>
                    </NavbarContent>
                    <NavbarContent justify="end">
                        <NavbarItem>
                            <Switch
                                size="lg"
                                color="primary"
                                defaultSelected
                                onValueChange={toggleTheme}
                                isSelected={currentTheme === 'dark'}
                            >
                            </Switch>
                        </NavbarItem>
                        <NavbarItem>
                            <Link onClick={() => router.push("/about")} className="cursor-pointer text-black bg-gradient-to-b bg-clip-text text-transparent dark:from-white dark:to-gray-400 font-bold">About</Link>
                        </NavbarItem>
                        <NavbarItem>
                            <Button onClick={() => router.push("/signup")} color="primary" variant="flat">Signup</Button>
                        </NavbarItem>
                    </NavbarContent>
                </NavbarContent>
                <NavbarMenu>
                    <NavbarMenuItem>
                        <Link onClick={() => router.push("/about")} className="cursor-pointer text-black dark:text-white">About Us</Link>
                    </NavbarMenuItem>
                    <NavbarMenuItem>
                        <div className="rounded-xl p-2 bg-gray-950/50 backdrop-blur w-52 h-14">
                        </div>
                    </NavbarMenuItem>
                    <NavbarMenuItem>
                        <Button onClick={() => router.push("/signup")} color="primary">Signup</Button>
                    </NavbarMenuItem>
                </NavbarMenu>
            </Navbar>


            <section className="flex justify-center relative items-center h-[calc(100vh-80px)] dark:bg-black">
                <div  id="n1" className="absolute hidden md:block z-50 top-16 left-16 rounded-xl rotate-12 w-52 h-min">
                    <NotificationCard notification={defaultNotification} className="dark:bg-neutral-900 rounded-xl shadow-xl" initiator={defaultUser} meetup={defaultMeetup} onClick={() => {return}}/>
                </div>
                <div id="m1" className="absolute bottom-16 hidden md:block right-16 rounded-xl -rotate-12 w-52 h-min">
                    <MeetupCard small creator={defaultUser} meetup={defaultMeetup}/>
                </div>
                <div id="u1" className="absolute bottom-16 left-16 rounded-xl -rotate-6 w-64 h-min">
                    <UserCard user={defaultUser}/>
                </div>
                <div id="n2" className="absolute top-8 right-8 rotate-3 rounded-xl w-72 h-min">
                    <NotificationCard notification={defaultNotification2} className="dark:bg-neutral-900 rounded-xl " initiator={defaultUser} meetup={defaultMeetup} onClick={() => {return}}/>
                </div>
                <div className="flex flex-col text-center p-4 items-center">
                    <h1 data-aos="fade-right" data-aos-duration="700" className="text-4xl md:text-5xl md:w-2/3 bg-clip-text h-32 text-transparent bg-gradient-to-b text-wrap from-white to-gray-500 font-semibold ">Never miss a moment with EventSync</h1>
                    <h2 data-aos="fade-left" data-aos-duration="700" className="text-lg text-black/30 dark:text-gray-400">Bringing <span className="font-bold">people</span> together has never been easier</h2>
                </div>
            </section>

            <section className="items-center p-4 mb-[12vh] mx-[5vw]">
                <h1 data-aos="fade-right" data-aos-duration="1000" className="text-7xl text-transparent bg-clip-text bg-gradient-to-b h-32 from-white to-gray-500 font-bold">Plan Easily</h1>

                <p data-aos-duration="1000" className="text-xl font-semibold mb-4 dark:text-gray-400 text-black/50">
                    Plan and create hangouts, meetups, and memorable get-togethers effortlessly. Event Sync simplifies scheduling, location sharing, and attendee management for seamless gatherings
                </p>
                <img src="/Meetup-Dark.png" alt="meetup"/>
            </section>

                <section className="items-center p-4 mb-[25vh] mx-[5vw]">
                    <h1 data-aos="fade-right" data-aos-duration="1000" className="text-7xl text-transparent bg-clip-text bg-gradient-to-b h-32 from-white to-gray-500 font-bold">Connect</h1>

                    <p data-aos-duration="1000" className="text-xl mb-4 font-semibold dark:text-gray-400 text-black/50">
                        Instantly share meetups with friends and family. Additionally create friend groups, manage your friends list, and collaborate on event planning [COMING SOON]
                    </p>

                    <img src="/Friends-Dark.png" className="rounded-xl" alt="friends"/>
                </section>


            


            </div>
        </div>
    );

}
