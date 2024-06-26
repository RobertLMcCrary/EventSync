// Attendees
import {Button, Autocomplete, AutocompleteItem, Avatar} from "@nextui-org/react";
import {XMarkIcon} from "@heroicons/react/24/solid";

import {useState} from "react";
import {User} from "@/types";
import {SearchIcon} from "lucide-react";

//  <Input  value={enteredName} onValueChange={(value) => setEnteredName(value)} endContent={<button disabled={!enteredName} onClick={addAttendee}><CheckIcon className="text-green-500 w-5 h-5 hover:text-green-400"/></button>} placeholder="Name / Email" className="w-full mt-2" />
export default function CreateMeetupStep3({attendees, setAttendees, friends, userEmail, meetupCreationLoading, createMeetup} : {attendees: User[], setAttendees: (p: (prev: any) => any[]) => void, friends: (User)[], userEmail: string, meetupCreationLoading: 0 | 1 | 2, createMeetup: () => void}){

    const [enteredName, setEnteredName] = useState<string>('');
    const [errorText, setErrorText] = useState<string>('');

    function addAttendee(id: string | null, friend: boolean){
        if (friend) {
            if (!id) return;

            if (attendees.find((user) => user._id==id)) return;
            const user = friends.find((user) => user?._id==id);
            if (!user) return;
            setAttendees((prev) => [...prev, user]);
            setErrorText('')
        } else {
            if (!id) return;
            // Check if id is an email
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(id)) {
                setErrorText('To add people without an account, or who are not friends with you, use their email address');
                return;
            }
            if (attendees.find((user) => user.email==id)) {
                setErrorText('User already added');
                return;
            }

            if (id == userEmail) {
                setErrorText('You cannot add yourself');
                return;
            }

            const pseudoUser = new User({username: id, _id: id, email: id, password: ""});
            setAttendees((prev) => [...prev, pseudoUser]);
            setErrorText('');
        }
        setEnteredName('')
    }


    return (
        <div className=" flex justify-center items-center h-full w-full">
            <div className="flex flex-col rounded-md w-96 h-auto p-4">
                <p className="text-2xl font-bold dark:text-white ">Attendees</p>
                <p className="text-lg dark:text-white">Who&apos;s coming?</p>
                <div className="flex flex-row space-x-2 w-ful mt-2 overflow-x-scroll">
                    { attendees.map((attendee, index) => (
                        <><div className="flex flex-row items-center rounded-md bg-stone-200 dark:bg-stone-800 p-2">
                            <p className="dark:text-white ">{attendee.username}</p>
                            <button onClick={() => setAttendees((prev) => prev.filter((_: any, i: number) => i != index))}><XMarkIcon className="h-4 w-4 ml-2 text-red-500"/></button>
                        </div></>
                    ))}
                </div>

                <div className=" mt-2 flex flex-row items-center">
                     <Autocomplete
                    classNames={{
                        base: "max-w-xs",
                        listboxWrapper: "max-h-[320px]",
                        selectorButton: "text-default-500"
                    }}
                    defaultItems={friends}
                    inputProps={{
                        classNames: {
                            input: "ml-1",
                            inputWrapper: "h-[48px]",
                        },
                    }}
                    listboxProps={{
                        hideSelectedIcon: true,
                        itemClasses: {
                            base: [
                                "rounded-medium",
                                "text-default-500",
                                "transition-opacity",
                                "data-[hover=true]:text-foreground",
                                "dark:data-[hover=true]:bg-default-50",
                                "data-[pressed=true]:opacity-70",
                                "data-[hover=true]:bg-default-200",
                                "data-[selectable=true]:focus:bg-default-100",
                                "data-[focus-visible=true]:ring-default-500",
                            ],
                        },
                    }}
                    aria-label="Select a user"
                    placeholder="Username / Email"
                    allowsCustomValue={true}
                    onSelectionChange={(key) => addAttendee(key ? key.toString() : null, true)}
                    onInputChange={(value: string) => setEnteredName(value)}
                    value={enteredName}
                    popoverProps={{
                        offset: 10,
                        classNames: {
                            base: "rounded-large",
                            content: "p-1 border-small border-default-100 bg-background",
                        },
                    }}
                    startContent={<SearchIcon className="text-default-400" strokeWidth={2.5} size={20} />}
                    radius="full"
                    variant="bordered"
                >
                         {(user: User) => (
                             user._id != "0" && user._id != "loading" ?
                                 <AutocompleteItem key={user._id} textValue={user.username}>
                                     <div className="flex justify-between items-center">
                                         <div className="flex gap-2 items-center">
                                             <Avatar alt={user.username} className="flex-shrink-0" size="sm"
                                                     src={user.avatar}/>
                                             <div className="flex flex-col">
                                                 <span className="text-small">{user.username}</span>
                                                 <span className="text-tiny text-default-400">{user.email}</span>
                                             </div>
                                         </div>
                                     </div>
                                 </AutocompleteItem> :
                                 user._id == "0" ? <AutocompleteItem key="0" isDisabled={true}>
                                     <p>No friends</p>
                                 </AutocompleteItem> :
                                     <AutocompleteItem key="loading" isDisabled={true}>
                                            <p>Loading...</p>
                                     </AutocompleteItem>
                         )}

                </Autocomplete>

                    <Button color="primary" disabled={!enteredName} onClick={() => addAttendee(enteredName, false)} className=" w-auto rounded-full ml-2 h-[48px]">Add</Button>
                </div>
                <p className="text-xs mt-0.5 text-red-500">{errorText}</p>
                <Button isLoading={meetupCreationLoading==1} onClick={createMeetup} color="primary" className="mt-2 w-full">Create</Button>
            </div>
        </div>
    )
}