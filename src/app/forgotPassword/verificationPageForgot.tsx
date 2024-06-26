import { Input, code } from '@nextui-org/react';
import { Saira_Extra_Condensed } from 'next/font/google';
import { ReactNode } from "react"
import reactNodeToString from "react-node-to-string"
import ReactDomServer from 'react-dom/server';



export default function VerificationPage({setCode, submit, error} : {setCode: (code: string) => void, submit: () => void, error: string}) {
    let codeProvided = JSON.stringify({setCode});
    // const work = {code};
    // const codeProvided = work.toLocaleString();
    // const work = {name: {name: {setCode}, text: "hi"};
    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen">
            <div className="flex flex-col w-1/3">
                {/* <p className="text-2xl font-bold dark:text-white">Verification for {codeProvided}</p> */}
                
                <p className="text-2xl font-bold dark:text-white">Verification</p>
                <p className="text-sm dark:text-white mb-4">Please enter the verification code sent to your email</p>
                <Input
                    placeholder="Verification Code"
                    onChange={(e) => setCode(e.target.value)}
                />
                <button onClick={submit} className="bg-blue-500 text-white mt-2 p-2 rounded-lg">Submit</button>
                <p className="text-red-500 text-sm mt-2">{error}</p>
            </div>
        </div>
    )
}