"use client";
import { useState, Suspense } from 'react';
import { UserCircleIcon, EyeIcon, EyeSlashIcon, LockClosedIcon, ArrowLongRightIcon } from "@heroicons/react/24/solid";
import Cookies from 'js-cookie';
import { useRouter } from "next13-progressbar";
import { useSearchParams } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import {Button, Skeleton, Input, Image} from "@nextui-org/react";



function LoginComponent() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    let params = useSearchParams();
    const [googleLoading, setGoogleLoading] = useState(false);
    const router = useRouter();




    function loginWithGoogle() {
        setGoogleLoading(true);
        googleLogin();
    }
    const googleLogin = useGoogleLogin({
        flow: "auth-code",
        scope: "openid profile email https://www.googleapis.com/auth/calendar.events",
        onSuccess: codeResponse => {
            fetch(process.env.NEXT_PUBLIC_GOOGLE_URL+'/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: codeResponse.code }),
            })
                .then((res) => {
                    res.json().then((data) => {
                        setGoogleLoading(false);
                        if (data.error) {
                            setError(data.error);
                        } else {
                            // Redirect to dashboard
                            Cookies.set('token', data.token);
                            if (data.id) {
                                // Redirect to get started page since the user is signing up
                                router.push('/get-started');
                                return;
                            }
                            if (params.has('redirect')) {
                                router.push(params.get('redirect') || '/dashboard');
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

    const handleSubmit = (e: { preventDefault: () => void; })  => {

        // POST request to /api/auth/signup
        e.preventDefault();
        if (!username || !password) {
            setError('Please fill in all fields');
            return;
        }
        setIsLoading(true);
        fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
            .then((res)=> {
                res.json().then((data) => {
                    setIsLoading(false);
                    if (data.error) {
                        setError(data.error);
                    } else {
                        // Redirect to dashboard
                        Cookies.set('token', data.token);

                        if (params.has('redirect')) {
                            router.push(params.get('redirect') || '/dashboard');
                            return;
                        }
                        router.push('/dashboard')
                    }
                });
            });
    };

    return (
        <div className="flex justify-center bg-white dark:bg-black items-center h-screen font-inter">
            <div className="w-[450px] p-6">
                <h2 className=" text-left text-3xl font-semibold mb-2">Log In</h2>
                <p className="text-gray-400 text-left text-sm mb-4">
                    Don&apos;t have an account?{' '}
                    <a className="underline text-blue-500 cursor-pointer" onClick={() => router.push('/signup?redirect='+ params.get('redirect') || '/dashboard')}>Sign Up</a>
                </p>

                    <div className="flex flex-col mb-4">
                        <h1 className="text-left font-semibold text-lg mb-2">Username / Email</h1>
                        <Input
                            type="text"
                            placeholder="Username / Email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            isRequired={true}
                            startContent={<UserCircleIcon className="w-6 h-6 text-gray-400" />}
                            autoComplete="email"
                            className="w-full rounded-lg filter dark:text-white text-black text-sm"
                        />

                    </div>
                    <div className="flex flex-col mb-6">
                        <h1 className="text-left text-lg font-semibold mb-2">Password</h1>
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            startContent={<LockClosedIcon className="w-6 h-6 text-gray-400" />}
                            endContent={<div className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeIcon className="w-6 h-6 text-gray-400" /> : <EyeSlashIcon className="w-6 h-6 text-gray-400" />}
                            </div>}
                            className="w-full rounded-lg filter  text-sm"
                        />


                    </div>
                    <p className="text-red-500 text-sm ">{error}</p>
                    <p className="text-blue-500 mb-2 text-sm"><span className="cursor-pointer rounded">Forgot Password?</span></p>
                    <Button onClick={handleSubmit} isDisabled={!username || !password} type="submit"  className="w-full bg-blue-500 flex items-center justify-center filter text-white p-6 rounded-full cursor-pointer text-base" isLoading={isLoading}>
                        Log In
                    </Button>
                    <p className="text-center text-xs mt-4 uppercase font-bold text-stone-400 ">Or continue with</p>
                    <Button isIconOnly type="button" onClick={loginWithGoogle} className="p-1 w-10 h-10 bg-white flex items-center justify-center filter drop-shadow-md text-black rounded-lg cursor-pointer mt-2" isLoading={googleLoading}>
                        <Image className="w-full h-full" src="/google_icon.svg" alt="Google"/>
                    </Button>

            </div>
        </div>
    );
}

export default function Login() {
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
            <LoginComponent />
        </Suspense>
    );
}
