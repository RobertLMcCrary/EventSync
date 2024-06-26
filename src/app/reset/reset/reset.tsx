"use client";
import { useState } from 'react';
import { UserCircleIcon, EyeIcon, EyeSlashIcon, LockClosedIcon, ArrowLongRightIcon } from "@heroicons/react/24/solid";
import useTheme from "@/app/components/utils/theme/updateTheme";
import Cookies from 'js-cookie';
import { useRouter } from "next13-progressbar";
import {Button} from "@nextui-org/react";



export default function resetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, changePassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [theme, setTheme] = useTheme();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const forgotPassword = useRouter();
    

    const handleSubmit = (e: { preventDefault: () => void; })  => {
        // POST request to /api/auth/signup
        e.preventDefault();
        setIsLoading(true);
        fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password, confirmPassword }),
        })
            .then((res)=> {
                res.json().then((data) => {
                    setIsLoading(false);
                    if (data.error) {
                        setError(data.error);
                    } else {
                        // Redirect to dashboard
                        Cookies.set('token', data.token);
                        router.push('/login')
                    }
                });
            });
        
    };


    return (
        <div className="flex justify-center items-center h-screen font-inter">
            <div className="w-[450px] p-6">
                <h2 className="text-black dark:text-white text-left text-3xl font-semibold mb-2">Forgot Password</h2>
                <p className="text-gray-400 text-left text-sm mb-4">
                    Enter a new password for your account.{' '}
                    
                </p>
                <form onSubmit={handleSubmit}>
                    {
                    <div className="relative mb-2">
                        <input
                            type="password"
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="password"
                            className="w-full px-6 py-[14px] pl-12 rounded-lg filter drop-shadow-md dark:text-white text-black text-sm"
                        />
                        <LockClosedIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />

                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => changePassword(e.target.value)}
                            required
                            autoComplete="password"
                            className="w-full px-6 py-[14px] pl-12 rounded-lg filter drop-shadow-md dark:text-white text-black text-sm"
                        />
                        <LockClosedIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                    </div>}
   
                    <Button type="submit"  className="w-full bg-blue-500 flex items-center justify-center filter drop-shadow-md text-white px-4 py-3 rounded-lg cursor-pointer text-base" isLoading={isLoading}>
                        Send Confirmation <ArrowLongRightIcon className="ml-4 w-6 h-6" />
                    </Button>
                </form>
            </div>
        </div>
    );
}