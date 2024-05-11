"use client";
import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";
import React, {useContext, useEffect} from "react";
import {expiredContext, useUser} from "@/app/providers";
import {useRouter} from "next13-progressbar";
import {usePathname} from "next/navigation";

export default function SessionExpiredModal(){
    const {expired, setExpired} = useContext(expiredContext);
    const {setUser} = useUser();
    const pathname = usePathname();
    const router = useRouter();





    return (
        <Modal isDismissable={false} isOpen={expired}>
            <ModalContent>
                <ModalHeader>Session Expired</ModalHeader>
                <ModalBody>
                    You are not logged in or your session has expired.
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => {
                        setUser(null);
                        router.push('/login?redirect='+(pathname || '/dashboard'));
                    }}>
                        Log In
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )

}