import { Input, Button } from '@nextui-org/react';


export default function VerificationPage({setCode, submit, error, isVerificationLoading, username} : {setCode: (code: string) => void, submit: () => void, error: string, isVerificationLoading: boolean, username: string}) {
    return (
        <div className="flex flex-col items-center justify-center bg-white dark:bg-black h-screen w-screen">
            <div className="flex flex-col w-1/3">
                <p className="text-2xl font-bold dark:text-white">Welcome {username}! </p>
                <p className="text-sm dark:text-white mb-4">Please enter the verification code sent to your email</p>
                <Input
                    placeholder="Verification Code"
                    onChange={(e) => setCode(e.target.value)}
                />
                <Button isLoading={isVerificationLoading} onClick={submit} className="bg-blue-500 text-white mt-2 p-2 rounded-full">Continue</Button>
                <p className="text-red-500 text-sm mt-2">{error}</p>
            </div>
        </div>
    )
}