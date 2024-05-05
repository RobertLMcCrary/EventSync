"use client";
import Image from "next/image";
import { Meetup, defaultMeetup, User, defaultUser } from "@/types";
import MeetupCard from "@/app/components/meetupCard";
import { useState, useEffect } from "react";
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
    toggle,
    NavbarMenu,
    NavbarMenuToggle,
    NavbarMenuItem
} from "@nextui-org/react"



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
        setTheme('light')
    }, [])

    return (
        <div className="bg-white dark:bg-black">

            <Navbar isBlurred maxWidth="full" className="bg-gray-200 dark:bg-slate-900">
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
                    <NavbarContent justify="center">
                        <NavbarItem>
                            <Switch
                                size="lg"
                                color="primary"
                                onValueChange={toggleTheme}
                            >
                            </Switch>
                        </NavbarItem>
                    </NavbarContent>
                    <NavbarContent justify="end">
                        <NavbarItem>
                            <Link onClick={() => router.push("/about")} className="cursor-pointer text-black dark:text-white">About Us</Link>
                        </NavbarItem>
                        <NavbarItem>
                            <Button onClick={() => router.push("/login")} color="primary">Login</Button>
                        </NavbarItem>
                    </NavbarContent>
                </NavbarContent>
                <NavbarMenu>
                    <NavbarMenuItem>
                        <Link onClick={() => router.push("/about")} className="cursor-pointer text-black dark:text-white">About Us</Link>
                    </NavbarMenuItem>
                    <NavbarMenuItem>
                        <Button onClick={() => router.push("/login")} color="primary">Login</Button>
                    </NavbarMenuItem>
                    <NavbarMenuItem>
                        <Button onClick={() => router.push("/signup")} color="primary">Signup</Button>
                    </NavbarMenuItem>
                </NavbarMenu>
            </Navbar>


            <section className="flex flex-col items-center justify-center h-[100vh] text-center bg-gradient-to-b from-gray-200 to-white  dark:from-slate-900 dark:to-black">
                <h1 data-aos="fade-right" data-aos-duration="700" className="text-[4vw] text-slate-900 dark:text-white font-bold mb-10">Connect, Plan, and Hang Out!</h1>
                <h2 data-aos="fade-left" data-aos-duration="700" className="text-[3vw] text-slate-900 dark:text-white">Bringing Friends Together Has Never Been Easier</h2>
            </section>


            <section className="text-center items-center mb-[25vh] mx-[5vw]">
                <h1 data-aos="fade-right" data-aos-duration="1000" className="text-[4vw] font-bold">What is EventSync?</h1>
                <p data-aos="fade-left" data-aos-duration="1000" className="text-[3vh] text-center">
                    EventSync is your all-in-one solution for effortless event planning and
                    coordination. Our platform simplifies the process of organizing memorable
                    gatherings with friends, offering intuitive tools for scheduling,
                    location sharing, attendee management, and real-time notifications. With
                    EventSync, you can easily connect with friends, plan hangouts, and create
                    unforgettable experiences, making every event a special celebration of friendship
                    and joy. Say goodbye to the hassle of coordinating events and hello to seamless
                    socializing with EventSync!
                </p>
            </section>


            <section className="gap-4 grid grid-cols-1 sm:grid-cols-3 mx-4">
                {features.map((feature) => (
                    <Card key={feature.id} className="items-center p-4 shadow-lg bg-gray-200 dark:bg-slate-900" data-aos="flip-down" data-aos-duration="1000">
                        <Image src="/lg-dark-logo.png" className="border-1 border-blue-500 rounded-lg" width={400} height={400} alt={feature.name + " demo image"} />
                        <CardHeader className="font-semibold text-2xl">{feature.name}</CardHeader>
                        <CardBody>{feature.info}</CardBody>
                    </Card>
                ))}
            </section>


            <section className="flex text-center items-center justify-center m-14">
                <div>
                    <h1 data-aos="fade-right" data-aos-duration="1000" className="mb-4 text-3xl text-center text-black dark:text-white font-bold mt-10">Don&apos;t have an account?</h1>
                    <Button color="primary" data-aos="fade-left" data-aos-duration="1000" onClick={() => router.push("/signup")}>Signup</Button>

                
                </div>
            </section>


            <section className="flex bg-gray-200 dark:bg-slate-900 justify-between border-solid border-slate-700 border-t-1">
                {currentTheme === 'dark' ? (
                    <Image width={100} height={100} src="/lg-dark-logo.png" alt="logo" />
                ) : (
                    <Image className="my-10" width={100} height={100} src="/lg-logo.png" alt="logo" />
                )}
                <Link onClick={() => router.push("/about")} className="cursor-pointer text-black dark:text-white mr-4">About Us</Link>
            </section>
        </div>
    );

}
