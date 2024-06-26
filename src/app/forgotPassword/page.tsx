"use client";
import {Button} from "@nextui-org/react";

require("dotenv").config({ path: ".env.local" });
import { useState } from 'react';
import { ArrowLongRightIcon, AtSymbolIcon, UserCircleIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import {useRouter} from "next13-progressbar";
import Cookies from 'js-cookie';
import useTheme from "@/app/components/utils/theme/updateTheme";
import VerificationPageForgot from "@/app/forgotPassword/verificationPageForgot";


export default function Signup() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [theme, setTheme] = useTheme();
    const [error, setError] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [showVerification, setShowVerification] = useState(false);
    const [code, setCode] = useState('');
    const [verificationError, setVerificationError] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [userID, setUserID] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    let [sentCode, setSentCode] = useState('');


    


    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setIsLoading(true);
        fetch('/api/auth/sendForgot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        })
            .then((res)=> {
                res.json().then((data) => {
                    setIsLoading(false);
                    if (data.error) {
                        setError(data.error);
                    } else {
                        // Redirect to dashboard
                        Cookies.set('token', data.token);
                        setUserID(data.id);
                        setShowVerification(true);
                        fetchVerificationCode();
                    }
                });
            });
    };
    function fetchVerificationCode(){
        fetch(process.env.NEXT_PUBLIC_MAIL_URL + '/send-test-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
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
            },
            body: JSON.stringify({ "$set" : { verified: true } }),

        });
        sentCode = verificationCode;
        router.push('/resetPassword');
    }

    if (showVerification){
        return (<VerificationPageForgot setCode={setCode} submit={submit} error={verificationError}></VerificationPageForgot>)
    }


    return (
        <div className="flex justify-center items-center h-screen font-inter">
            <div className="w-[450px] p-6">
                <h2 className="text-black dark:text-white text-left text-3xl font-semibold mb-2">Forgot Password</h2>
                <p className="text-gray-400 text-left text-sm mb-4">
                    Type in your email so you can reset your password.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="relative mb-[10px]">
                        <input
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
                    <p className="text-red-500 text-sm mb-4">{error}</p>
                    <Button type="submit"  className="w-full bg-blue-500 flex items-center justify-center filter drop-shadow-md text-white px-4 py-3 rounded-lg cursor-pointer text-base" isLoading={isLoading}>
                        Send Confirmation Email <ArrowLongRightIcon className="ml-4 w-6 h-6" />
                    </Button>
                </form>
            </div>
        </div>
    );
}