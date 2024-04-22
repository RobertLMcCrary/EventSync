import { XMarkIcon } from "@heroicons/react/20/solid";
import {User} from "@/types";
import { useRouter } from 'next13-progressbar';

export default function UserTooltip({ user } : { user: User }){
    const router = useRouter();


    return (
        <div className="flex flex-col w-full h-full py-2 px-1">
            <p onClick={() => router.push('/users/'+user._id)} className="text-lg text-stone-500 hover:text-stone-600 dark:hover:text-neutral-400 dark:text-neutral-500">Profile</p>
          <p onClick={() => router.push('/signout')} className="text-lg hover:text-red-700 text-red-500">Sign out</p>
        </div>
  )
}