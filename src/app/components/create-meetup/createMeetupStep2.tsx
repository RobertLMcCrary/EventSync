import React from 'react';
import {Input, Button, DatePicker} from "@nextui-org/react";
import {
    DateValue,
} from "@internationalized/date";

// Date, time, location
export default function CreateMeetupStep2({dateTime, location, setDateTime, setLocation, changeStep} : {dateTime: DateValue, location: string, setDateTime: any, setLocation: (location: string) => void, changeStep: () => void}) {{}
    return (
        <div className=" flex justify-center items-center h-full w-full">
            <div className="flex flex-col rounded-md w-auto h-auto p-4">
                <p className="text-2xl font-bold dark:text-white mb-4">Date, time, location</p>
                <DatePicker
                    label="Event Date"
                    variant="bordered"
                    hideTimeZone
                    showMonthAndYearPickers
                    value={dateTime}
                    onChange={setDateTime}

                />
                <Input placeholder={location || "Location"} className="w-full mt-2" onValueChange={setLocation}/>
                <Button isDisabled={!location} onClick={changeStep} color="primary" className="mt-2 w-full">Continue</Button>
            </div>
        </div>
    )
}