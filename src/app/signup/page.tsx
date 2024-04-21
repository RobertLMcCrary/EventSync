"use client";
import {Button, Skeleton} from "@nextui-org/react";

require("dotenv").config({ path: ".env.local" });
import {useEffect, useState, Suspense} from 'react';
import { ArrowLongRightIcon, AtSymbolIcon, UserCircleIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import {useRouter} from "next13-progressbar";
import Cookies from 'js-cookie';
import useTheme from "@/app/components/utils/theme/updateTheme";
import VerificationPage from "@/app/signup/verificationPage";
import {useSearchParams} from "next/navigation";
import {useGoogleLogin} from "@react-oauth/google";

function SignupComponent() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [showVerification, setShowVerification] = useState(false);
    const [code, setCode] = useState('');
    const [verificationError, setVerificationError] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [userID, setUserID] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [inviteData, setInviteData] = useState({} as any);
    const [inviteError, setInviteError] = useState('' as string);
    const [emailDisabled, setEmailDisabled] = useState(false);

    const [googleLoading, setGoogleLoading] = useState(false);


    function signupWithGoogle() {
        setGoogleLoading(true);
        googleSignup();
    }
    const googleSignup = useGoogleLogin({
        flow: "auth-code",
        onSuccess: codeResponse => {
            fetch(process.env.NEXT_PUBLIC_GOOGLE_URL+'/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: codeResponse.code, inviteEmail: inviteData ? inviteData.userID : null}),
            })
                .then((res) => {
                    res.json().then((data) => {
                        setGoogleLoading(false);
                        if (data.error) {
                            setError(data.error);
                        } else {
                            // Redirect to dashboard

                            Cookies.set('token', data.token);
                            if (searchParams.has('meetupInvite')){
                                updateMeetupInvite(data);
                                router.push('/meetups/invite/'+searchParams.get('meetupInvite'));
                                return;
                            }
                            if (searchParams.has('redirect')) {
                                router.push(searchParams.get('redirect') || '/dashboard');
                                return;
                            }
                            router.push('/dashboard')
                        }
                    });
                });

        },
        onError: error => {
            setError(error.error ? error.error : "An error occurred")
            setGoogleLoading(false);
        }
    });

    useEffect(() => {
        if (searchParams.has('meetupInvite')) {
            const token = searchParams.get('meetupInvite');
            fetch('/api/auth/verify', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }).then((res) => {
                res.json().then((data) => {
                    if (data.error) {
                        setInviteError("This invite is invalid or has expired");
                    } else {
                        if (data.data.type !== 'meetup-invitation') {
                            setInviteError("This invite is invalid or has expired");
                            return;
                        }
                        if (!data.data.userID.includes('@')){
                            setInviteError("You already have an account. Please use the original invite link");
                            return;
                        }
                        // Check if user exists
                        // If user exists, redirect to meetup invite page
                        // If user does not exist, show signup form
                        fetch(`/api/user/find`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ email: data.data.userID }),
                        }).then((res) => {
                            res.json().then((userData) => {
                                if (userData.error) {
                                    setEmail(data.data.userID);
                                    setEmailDisabled(true);
                                    setInviteData(data.data);
                                } else {
                                    router.push('/meetups/invite/'+token);
                                }
                            });
                        });
                    }
                });
            });
        }
    }, [router, searchParams]);
    const handleSubmit = (e: { preventDefault: () => void; }) => {
        // POST request to /api/auth/signup
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (!email || !username || !password) {
            setError('Please fill in all fields');
            return;
        }
        setIsLoading(true);
        fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, username, password }),
        })
            .then((res)=> {
                res.json().then((data) => {
                    setIsLoading(false);
                    if (data.error) {
                        setError(data.error);
                    } else {
                        // Redirect to dashboard
                        if (inviteData){
                            updateMeetupInvite(data);
                        }
                        Cookies.set('token', data.token);
                        setUserID(data.id);
                        setShowVerification(true);
                        fetchVerificationCode();
                    }
                });
            });
    };
    function fetchVerificationCode(){
        fetch(process.env.NEXT_PUBLIC_MAIL_URL + '/send-verification-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, username }),
        }).then((res) => {
            res.json().then((data) => {
                if (data.error) {
                    setVerificationError(data.error);
                } else {
                    setVerificationCode(data.message);
                }
            });
        });
    }

    function submit() {
        if (code !== verificationCode) {
            setVerificationError('Invalid verification code');
            return;
        }
        fetch(`/api/user/${userID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('token')} `
            },
            body: JSON.stringify({ "$set" : { verified: true } }),

        });
        if (searchParams.has("meetupInvite")) {
            router.push(`/meetups/invite/${searchParams.get("meetupInvite")}`);
        } else {
            router.push('/dashboard');
        }
    }

    function updateMeetupInvite(data: any) {
        fetch(`/api/meetup/${inviteData.meetup}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.token} `
                },
                body: JSON.stringify({'$push': {invited: data.id}})
            });
        fetch(`/api/meetup/${inviteData.meetup}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.token} `
                },
                body: JSON.stringify({'$pull': {invited: email}})
            });
    }

    if (showVerification){
        return (<VerificationPage setCode={setCode} submit={submit} error={verificationError}></VerificationPage>)
    }
    return (
        <div className="flex justify-center items-center h-screen font-inter">
            <div className="w-[450px] p-6">
                { !inviteError || !searchParams.has("meetupInvite") ?
                    searchParams.has("meetupInvite") && !inviteData ?
                            <>
                                <Skeleton className="w-full h-10 mb-2" />
                                <Skeleton className="w-[4/5] h-10 mb-2" />
                                <Skeleton className="w-[3/5] h-10 mb-4" />
                                <Skeleton className="w-full h-10 mb-2" />
                                <Skeleton className="w-full h-10" />
                            </> :
                    <><h2 className="text-black dark:text-white text-left text-3xl font-semibold mb-2">{ searchParams.has("meetupInvite") ? "Please sign up to accept this invite" : "Sign Up"}</h2>
                <p className="text-gray-400 text-left text-sm mb-4">
                    Already have an account?&nbsp;
                    <a className="underline text-blue-500 cursor-pointer" onClick={() => router.push('/login')}>Login</a>
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="relative mb-[10px]">
                        <input disabled={emailDisabled}
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            className="w-full px-6 py-[14px] pl-12 rounded-lg filter drop-shadow-md text-black dark:text-white text-sm"
                        />
                        <AtSymbolIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                    </div>
                    <div className="relative mb-[10px]">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoComplete="off"
                            className="w-full px-6 py-[14px] pl-12 rounded-lg filter drop-shadow-md text-black dark:text-white text-sm"
                        />
                        <UserCircleIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                    </div>
                    <div className="relative mb-[10px]">
                        <input
                            type="text"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                            className="w-full px-6 py-[14px] pl-12 rounded-lg filter drop-shadow-md dark:text-white text-black text-sm"
                        />
                        <LockClosedIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                    </div>
                    <div className="relative mb-[10px]">
                        <input
                            type="text"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                            className="w-full px-6 py-[14px] pl-12 rounded-lg filter drop-shadow-md dark:text-white text-black text-sm"
                        />
                        <LockClosedIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-red-500 text-sm mb-4">{error}</p>
                    <Button type="submit"  className="w-full bg-blue-500 flex items-center justify-center filter drop-shadow-md text-white px-4 py-3 rounded-lg cursor-pointer text-base" isLoading={isLoading}>
                        Signup <ArrowLongRightIcon className="ml-4 w-6 h-6" />
                    </Button>
                    <p className="text-center text-xs mt-4 uppercase font-bold text-stone-400 ">Or continue with</p>
                    <Button isIconOnly type="button" onClick={signupWithGoogle} className="p-1 w-10 h-10 bg-white flex items-center justify-center filter drop-shadow-md text-black rounded-lg cursor-pointer mt-2" isLoading={googleLoading}>
                        <img className="w-full h-full" src="/google_icon.svg" alt="Google"/>
                    </Button>


                </form></>
                    : null }

                {inviteError ? <p className="font-bold text-xl mb-4">{inviteError}</p> : null}
            </div>
        </div>
    );
}

export default function Signup() {
    return (
        <Suspense fallback={
            <div className="w-[400px] h-[400px]">
                <Skeleton className="w-full h-5 mb-1" />
                <Skeleton className="w-[4/5] h-5 mb-1" />
                <Skeleton className="w-full h-5 mb-4" />
                <Skeleton className="w-full h-5 mb-1" />
                <Skeleton className="w-full h-5" />
            </div>
        }>
            <SignupComponent />
        </Suspense>
    );
}
