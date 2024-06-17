"use client";
import Image from "next/image";
import { useEffect } from "react";
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
        <div className="bg-white w-screen ">
            <div className="bg-gradient-to-b from-blue-500/30 via-green-500/30 to-red-500/30">
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


            <section className="flex justify-center items-center h-[calc(100vh-80px)] dark:from-slate-900 dark:to-black">
                <div className="flex flex-col text-center">
                    <h1 data-aos="fade-right" data-aos-duration="700" className="md:text-9xl text-8xl bg-clip-text h-40 text-transparent bg-gradient-to-r from-green-500/60 to-blue-500 font-bold md:mb-4">EventSync</h1>
                    <h2 data-aos="fade-left" data-aos-duration="700" className="md:text-2xl text-lg font-bold text-black/30 dark:text-white">Bringing <span className="bg-gradient-to-r bg-clip-text from-blue-500 to-green-500 text-transparent">friends</span> together has never been easier</h2>
                </div>
            </section>



            <section className="items-center p-4 mb-[25vh] mx-[5vw]">
                <h1 data-aos="fade-right" data-aos-duration="1000" className="text-9xl font-bold">Hang Out</h1>
                <p data-aos-duration="1000" className="text-xl font-bold mt-8 text-black/50">
                    Create memorable hangouts with friends effortlessly. Event Sync simplifies scheduling, location sharing, and attendee management for seamless gatherings
                </p>
            </section>

                <section className="items-center p-4 mb-[25vh] mx-[5vw]">
                    <h1 data-aos="fade-right" data-aos-duration="1000" className="text-9xl font-bold">Connect</h1>
                    <p data-aos-duration="1000" className="text-xl font-bold mt-8 text-black/50">
                        Create memorable hangouts with friends effortlessly. Event Sync simplifies scheduling, location sharing, and attendee management for seamless gatherings
                    </p>
                </section>

                <section className="items-center p-4 mb-[25vh] mx-[5vw]">
                    <h1 data-aos="fade-right" data-aos-duration="1000" className="text-9xl font-bold">Plan</h1>
                    <p data-aos-duration="1000" className="text-xl font-bold mt-8 text-black/50">
                        Create memorable hangouts with friends effortlessly. Event Sync simplifies scheduling, location sharing, and attendee management for seamless gatherings
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
        </div>
    );

}
