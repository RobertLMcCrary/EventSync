"use client";
import {Button, Code, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";
import React, {useContext} from "react";
import {globalErrorContext} from "@/app/providers";

export default function ErrorModal() {
    const {globalError, setGlobalError} = useContext(globalErrorContext);
    function onOpenChange() {
        if (globalError) {
            setGlobalError("")
        }
    }
    return (
        <Modal isOpen={!!globalError} onOpenChange={onOpenChange}>
            <ModalContent>
                <ModalHeader>Sorry</ModalHeader>
                <ModalBody>
                    There was an unexpected error. Please try again later.
                    <Code color="danger" size="lg">{globalError}</Code>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => {
                        setGlobalError("")
                    }}>
                        Ok
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}