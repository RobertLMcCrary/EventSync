"use client"
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
    Switch
} from "@nextui-org/react"

//team member object for cards
type TeamMember = {
    name: string;
    role: string;
}

function About() {
    const router = useRouter()

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

    useEffect(() => {
        AOS.init()
    })

    const teamMembers: TeamMember[] = [
        {
            name: 'Aaryan Parikh',
            role: 'CEO & Co-Founder',
        },
        {
            name: 'Neel Parpia',
            role: 'CTO & Co-Founder',
        },
        {
            name: 'Eshaan E',
            role: 'Senior Software Developer',
        },
        {
            name: 'Prakhar Rathore',
            role: 'Senior Software Developer',
        },
        {
            name: 'Nicholas Wang',
            role: 'Co-Founder'
        },
        {
            name: 'Robert McCrary',
            role: 'Software Developer',
        },
        {
            name: 'Jake Orchanian',
            role: 'Software Developer',
        }
    ];

    return (
        <div className="bg-white dark:bg-black">
            <Navbar isBlurred maxWidth="full">
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
                            defaultSelected
                            size="lg"
                            color="primary"
                            onValueChange={toggleTheme}
                        >
                        </Switch>
                    </NavbarItem>
                </NavbarContent>
                <NavbarContent justify="end">
                    <NavbarItem>
                        <Link onClick={() => router.push("/")} className="cursor-pointer text-black dark:text-white">Home</Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Button onClick={() => router.push("/login")} color="primary">Login</Button>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>

            <section className="py-8 px-8">
                <h2 className="text-2xl font-bold mb-4">Our Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {teamMembers.map((member) => (
                        <Card data-aos="flip-down" data-aos-duration="1000" key={member.name} className="bg-gray-200 dark:bg-slate-900 rounded-lg shadow-lg p-6">
                            <CardHeader className="text-xl font-bold">{member.name}</CardHeader>
                            <CardBody>{member.role}</CardBody>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="py-8 my-20 px-8 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
                <h2 className="text-2xl font-bold mb-4">Our Goal</h2>
                <p className="text-xl">
                    EventSync is committed to enhancing the way friends connect and enjoy shared experiences.
                    Our platform is designed to facilitate seamless and enjoyable hangouts among friends,
                    offering a range of intuitive features for effortless event planning and coordination.
                    From scheduling gatherings and sharing locations to managing attendee preferences and
                    sending timely notifications, EventSync streamlines the entire process, ensuring that
                    friends can come together and create unforgettable memories without the usual hassle.
                    With EventSync, every hangout becomes an opportunity to strengthen bonds, foster deeper
                    connections, and make every moment spent with friends truly special and memorable.
                </p>
            </section>

            <section className="text-center items-center mb-20">
                <h1 className="text-3xl font-bold">Check out our <a className="text-blue-600 underline" href="https://www.linkedin.com/company/event-sync/">IOS App!</a></h1>
                <div className="flex justify-around mt-[10vh]">
                    <h1 className="text-2xl font-bold">Coming Soon...</h1>
                </div>
            </section>

            <section className="m-14 text-center">
                <h1 className="text-3xl font-bold">Check us out on <a className="text-blue-600 underline" href="https://www.linkedin.com/company/event-sync/">LinkedIn!</a></h1>
                <div className="flex justify-between gap-[30px]">
                    <img className="w-[40vw] h-auto" data-aos-delay="500" data-aos="fade-down-right" src="/LinkedIn-logo-for-about-page.png" alt="LinkedIn Logo" />
                    {currentTheme === 'dark' ? (
                        <img className="w-[40vw] h-auto" data-aos-delay="500" data-aos="fade-up-left" src="/lg-dark-logo.png" alt="Logo" />
                    ) : (
                        <div>
                            <img className="w-[40vw]" data-aos-delay="500" data-aos="fade-up-left" src="/sm-logo.png" alt="Logo" />
                        </div>
                    )}
                </div>
            </section>

            <section className="flex bg-gray-200 dark:bg-slate-900 justify-between border-solid border-slate-700 border-t-1">
                {currentTheme === 'dark' ? (
                    <Image width={100} height={100} src="/lg-dark-logo.png" alt="logo" />
                ) : (
                    <Image className="my-10" width={100} height={100} src="/lg-logo.png" alt="logo" />
                )}
                <Link onClick={() => router.push("/")} className="cursor-pointer text-black dark:text-white mr-4">Home</Link>
            </section>
        </div>
    )
}

export default About;
