// TODO: Complete the Settings component
"use client";
import Sidebar from "@/app/components/sidebar";
import {userContext} from "@/app/providers";
import useSession from "@/app/components/utils/sessionProvider";
import {useContext, useState} from "react";
import {Button, Tabs, Tab, Avatar, Badge, Switch, Skeleton, Autocomplete, AutocompleteItem} from "@nextui-org/react";
import { PencilSquareIcon, PencilIcon } from "@heroicons/react/24/outline";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/solid";
import interestsList from "@/app/api/utils/INTERESTS_LIST.json";
import {useTheme} from "next-themes";
import {useGoogleLogin} from "@react-oauth/google";
import Cookies from "js-cookie";
import {User} from "@/types";

export default function Settings() {
    const {user, updateUser} = useContext(userContext);
    const [googleAccount, setGoogleAccount] = useState<any>({});
    const [googleError, setGoogleError] = useState<string>("");
    const [updateError, setUpdateError] = useState<string>("");
    const session = useSession();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [editUsername, setEditUsername] = useState<boolean>(false);
    const [google, setGoogle] = useState<boolean>(false);
    const [updatedUser, setUpdatedUser] = useState<User | null>(null);
    const {setTheme} = useTheme();
    const [loadingGoogle, setLoadingGoogle] = useState<boolean>(false);
    function connectGoogle() {
        if (!user) return;
        setLoadingGoogle(true);
        googleAuth();
    }

    function disconnectGoogle() {
        if (!user) return;

        setGoogleAccount({});
        fetch('/api/user/' + user._id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session.session.token,
            },
            body: JSON.stringify({$set: {googleAccount: null}}),
        }).then((res) => {
            if (!res.ok) {
                setGoogleError("An error occurred while disconnecting your Google account");
                return;
            }
        });
    }

    const googleAuth = useGoogleLogin({
        flow: "auth-code",
        onSuccess: codeResponse => {
            fetch(process.env.NEXT_PUBLIC_GOOGLE_URL+'/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: codeResponse.code, integrationEmail: user?.email}),
            })
                .then((res) => {
                    res.json().then((data) => {
                        if (data.error) {
                            setLoadingGoogle(false)
                            setGoogleError(data.error);
                        } else {
                            updateUser().then(() => {
                                fetchGoogleAccount();
                            });
                            Cookies.set('token', data.token);
                        }
                    });
                });

        },
        onError: error => {
            setGoogleError(error.error ? error.error : "An error occurred")
        }
    });

    function submitChanges() {
        if (!updatedUser) return;
        setIsLoading(true);

        const changes = {
            $set: {
                interests: updatedUser.interests,
                theme: updatedUser.theme,
                email: updatedUser.email,
                username: updatedUser.username,
                verified: updatedUser.verified,
                avatar: updatedUser.avatar,
            }
        }


        fetch(`/api/user/${updatedUser._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.session.token}`
            },
            body: JSON.stringify(changes)
        }).then((res) => {

            if (!res.ok) {
                setIsLoading(false);
                setUpdateError("An error occurred while updating your settings. Please try again");
                return;
            }
            updateUser().then(() => {
                setIsLoading(false)
                if (updatedUser.theme) setTheme(updatedUser.theme);
            });
        });
    }
    if (user){
        if (updatedUser == null) setUpdatedUser(user);
        if (!googleAccount && user.googleAccount) {
            setGoogle(true);
            fetchGoogleAccount();
        }

    }

    function fetchGoogleAccount() {
        if (!user) {
            return;
        }
        setLoadingGoogle(true);
        if (user.googleAccount) {
            fetch(process.env.NEXT_PUBLIC_GOOGLE_URL + '/user', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({tokens: user.googleAccount, userID: user._id}),
            }).then((res) => {
                setLoadingGoogle(false);
                if (!res.ok) {
                    fetch('/api/user/'+user._id, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + session.session.token,
                        },
                        body: JSON.stringify({$set: {googleAccount: null}}),
                    });
                    setGoogleError("An error occurred while fetching your Google account. Please reconnect.");

                    return
                }
                res.json().then((data) => {
                    setGoogleAccount(data);
                });
            });
        }
    }

  return (
      <div className="flex flex-row bg-neutral-100 dark:bg-black h-screen w-screen">
          <Sidebar user={user} active="settings"/>
          <div className="relative flex flex-col h-screen w-full">
              <div className="dark:bg-stone-900 w-full p-4">
                  <h1 className="text-2xl font-bold">Settings</h1>
              </div>

              <Tabs variant="solid" className=" relative w-full p-2 justify-end flex border-b dark:border-stone-800" aria-label="Tabs variants">
                  <Tab key="Account" title="Account">
                      <div className="flex flex-col ">
                      <div className="flex flex-row p-4 border-b dark:border-stone-800 items-center">
                          <div className="sm:absolute h-24 w-24 sm:w-64 sm:h-64 sm:top-24">
                              <Badge placement="bottom-right"  shape="circle" color="default" content={<PencilIcon className="w-5 h-5 my-2 mx-1  dark:text-stone-400 "/>}>
                                  <Avatar src={user?.avatar} size="lg" className=" h-24 w-24 sm:w-64 sm:h-64" isBordered />
                              </Badge>
                          </div>
                              <div className="flex flex-col ml-8 sm:ml-80 justify-center">
                                <div className="flex flex-row items-center">
                                    <p className="text-5xl font-bold ">{updatedUser?.username}</p>

                                    <PencilSquareIcon className="h-5 w-5 ml-4 dark:text-stone-400 dark:hover:text-stone-300 cursor-pointer" />
                                </div>
                                  <div className="flex flex-row items-center mb-2">
                                      {updatedUser && updatedUser?.verified ? <CheckIcon className="h-5 w-5 mt-0.5 text-green-500"/> : <XMarkIcon className="h-5 w-5 mt-0.5 text-red-500"/>}
                                      <p className="ml-2 text-xl dark:text-stone-400 font-semibold ">{updatedUser?.email}</p>

                                      <PencilSquareIcon className="h-5 w-5 ml-4 dark:text-stone-400 dark:hover:text-stone-300 cursor-pointer" />
                                  </div>
                                  {updatedUser && !updatedUser?.verified ? <p className="text-sm text-red-500">Please verify your email address</p> : null}
                            </div>
                      </div>
                          <div className="sm:ml-80 w-full border-b items-center dark:border-stone-800 mb-2 sm:w-[calc(100%-320px)] flex flex-row justify-between p-4">
                          <p className="font-semibold text-xl ">Appearance</p>
                              <Tabs onSelectionChange={(key) => setUpdatedUser((prevUser: User | null) => (prevUser ? new User({...prevUser, theme: key.toString() as "light" | "dark" | "system" | undefined}) : null))} selectedKey={updatedUser ? updatedUser.theme : "light"}>
                                  <Tab key="light" title="light"/>
                                    <Tab key="dark" title="dark"/>
                                  <Tab key="system" title="system"/>
                              </Tabs>
                          </div>
                          <div className=" w-full border-b items-center dark:border-stone-800 mb-2 flex flex-row justify-between p-4">
                              <p className="sm:ml-80 font-semibold text-xl  ">Password</p>
                              <div className="flex flex-row">
                              <p className={user?.password ? "dark:text-stone-400" : "text-red-500"}> {user?.password ? "*****": "Please create a password to use email login"}</p>
                                  <PencilSquareIcon className="h-5 w-5 ml-4 dark:text-stone-400 dark:hover:text-stone-300 cursor-pointer" />
                             </div>
                          </div>
                          <div className=" w-full flex flex-col p-4">
                              <div className="flex flex-row items-center justify-between">
                              <p className="font-semibold text-xl ">Interests</p>

                              <Autocomplete
                                  label="Interests"
                                  placeholder="Search interests"
                                  className="max-w-xs"
                                  defaultItems={interestsList}
                                  onSelectionChange={(item) => item ? setUpdatedUser((prevUser: User | null) => (prevUser ? new User({...prevUser, interests: [...prevUser.interests, item.toString()]}) : null)) : null}
                              >
                                  {interestsList.map((item, index) => <AutocompleteItem key={item}>{item}</AutocompleteItem>)}
                              </Autocomplete>
                              </div>


                              <div className="mt-2 w-full inline-block">
                                  {updatedUser?.interests.map((item, index) => (
                                      <div key={index} style={{display: "inline-flex"}} className="m-1 w-fit p-2 px-4  rounded-xl dark:border-stone-800 border dark:bg-stone-950 flex flex-row justify-between items-center">
                                      <p className="font-semibold text-base mr-2 ">{item}</p>
                                          <Button isIconOnly variant="flat" className="bg-transparent" onClick={ () => setUpdatedUser((prevUser: User | null) => (prevUser ? new User({...prevUser, interests: prevUser.interests.filter((interest) => interest != item)}) : null))}>
                                            <XMarkIcon className="text-red-500 w-5 h-5 hover:text-red-400"/>
                                          </Button>
                                      </div>
                                  ))}
                              </div>
                          </div>

                      </div>
                  </Tab>
                  <Tab key="Integrations" title="Integrations">
                  <div className="flex flex-col p-4">
                      <div className="flex flex-col">
                          <div className="flex flex-row justify-between mb-4 items-center">
                              <p className="font-bold text-xl">Google</p>
                              <Switch isSelected={google} onChange={() => {
                                  if (google) disconnectGoogle();
                                  if (!google) connectGoogle();
                                  setGoogle(!google);
                              }}/>
                          </div>
                          <p className={googleError ? "text-red-500 mb-4" : "hidden"}>{googleError}</p>
                          <div className={google ? "flex flex-row w-full items-center p-2" : "hidden"}>
                              {!loadingGoogle ?
                                  <div className="flex flex-col sm:flex-row sm:items-center w-full justify-items-start sm:justify-between">
                                      <div className="flex flex-row items-center mb-4 sm:mb-0">
                                          <Avatar src={googleAccount.picture} isBordered size="lg" className="mr-2"/>
                                            <div className="flex flex-col ml-4">
                                                <p className="text-2xl font-bold">{googleAccount.name}</p>
                                                <p className="text-lg">{googleAccount.email}</p>
                                            </div>
                                      </div>
                                      <div className="flex flex-row items-center">
                                          <div className="flex flex-col text-start  mr-4">
                                                <p className="text-lg font-semibold mb-1">Google Calendar Integration</p>
                                              <p className="text-sm dark:text-stone-400">Automatically send meetups to Google Calendar</p>
                                          </div>
                                          <Switch isSelected={true} onChange={() => null}/>
                                      </div>
                                  </div> :
                                  <div className="w-full flex flex-col">
                                    <Skeleton className="w-[3/5] h-15"/>
                                    <Skeleton className="w-[4/5] h-15"/>
                                    </div>
                              }

                          </div>
                      </div>
                  </div>
                  </Tab>
                  <Tab key="videos" title="Videos"/>
              </Tabs>

              <div className="w-full p-4  absolute bottom-0 flex items-center justify-between flex-row  dark:bg-stone-900">
                  <p className="dark:text-stone-400">Please make sure to save your changes !</p>
                  <div className="flex flex-col">
                  <Button onClick={submitChanges} isLoading={isLoading} color="success" className="w-auto text-white ">Save</Button>
                      <p className={updateError ? "text-red-500 mt-1" : "hidden"}>{updateError}</p>
                  </div>
              </div>
          </div>
      </div>
  )
}