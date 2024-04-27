
"use client";
import Image from "next/image";
import { Meetup, defaultMeetup, User, defaultUser } from "@/types";
import MeetupCard from "@/app/components/meetupCard";
import { useState, useEffect } from "react";
import { useRouter } from "next13-progressbar"

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
    NavbarItem
} from "@nextui-org/react"


type Feature = {
    name: string,
    id: number,
    info: string,
    image: string
}

export default function Home() {
    const router = useRouter();

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
    }, [])

    return (
        <div className="h-[100vh] w-full">

            <Navbar maxWidth="full">
                <NavbarContent justify="start">
                    <NavbarBrand>
                        <Image
                            src="/sm-dark-logo.png"
                            width={60}
                            height={60}
                            alt="Logo"
                            className="max-h-20 px-[-10px] m-[-10px]"
                        />
                        <h1>EventSync</h1>
                    </NavbarBrand>
                </NavbarContent>
                <NavbarContent justify="end">
                    <NavbarItem>
                        <Link onClick={() => router.push("/about")} className="cursor-pointer text-white">About Us</Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Button onClick={() => router.push("/login")} color="primary">Login</Button>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>


            <section className="flex flex-col items-center justify-center h-[100vh] text-center bg-gradient-to-b from-slate-900 to-black">
                <h1 data-aos="fade-right" data-aos-duration="700" className="text-5xl font-bold mb-4">Connect, Plan, and Hang Out!</h1>
                <h2 data-aos="fade-left" data-aos-duration="700" className="text-[3vw]">Bringing Friends Together Has Never Been Easier</h2>
            </section>


            <section className="text-center items-center mb-[25vh] mx-[5vw]">
                <h1 data-aos="fade-right" data-aos-duration="1000" className="font-bold text-xl mb-4">What is EventSync?</h1>
                <p data-aos="fade-left" data-aos-duration="1000" className="text-[2vw] text-center">
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


            <section className="gap-4 grid grid-cols-3">
                {features.map((feature) => (
                    <Card key={feature.id} data-aos="flip-down" data-aos-duration="1000">
                        <Image src="/lg-dark-logo.png" width={100} height={100} alt={feature.name + " demo image"} />
                        <CardHeader>{feature.name}</CardHeader>
                        <CardBody>{feature.info}</CardBody>
                    </Card>
                ))}
            </section>


            <section className="flex text-center items-center justify-center mt-14">
                <div>
                    <h1 data-aos="fade-right" data-aos-duration="1000" className="text-3xl text-center font-bold mt-10">Don&apos;t have an account?</h1>
                    <button data-aos="fade-left" data-aos-duration="1000" onClick={() => router.push("/signup")} className=" m-10 text-2xl text-center font-bold w-48 p-4 bg-blue-500 hover:bg-blue-700 transition-colors duration-300  rounded-md">Signup</button>
                </div>
            </section>


            <section className="flex justify-between">
                <Image width={100} height={100} src="/lg-dark-logo.png" alt="logo" />
                <Link onClick={() => router.push("/about")} className="cursor-pointer text-white">About Us</Link>
            </section>
        </div>
    );

}
