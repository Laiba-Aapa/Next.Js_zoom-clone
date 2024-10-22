"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModal from './MeetingModal'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useToast } from "@/hooks/use-toast"
import { Textarea } from './ui/textarea'
import ReactDatepicker from 'react-datepicker'

const MeetingTypeList = () => {

    const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantmeeting' | undefined>()
    const router = useRouter();

    const { toast } = useToast()

    const { user } = useUser();
    const client = useStreamVideoClient();
    const [values, setValues] = useState({
        dateTime: new Date(),
        description: '',
        link: '',
    })

    const [callsDetails, setCallsDetails] = useState<Call>()

    const createMeeting = async () => {
        if (!user || !client) return;
        try {
            if (!values.dateTime) {
                toast({
                    title: "Please Select a date and time",
                })
                return;
            }
            const id = crypto.randomUUID();
            const call = client.call('default', id)

            if (!call) throw new Error('Failed to create a call')

            const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
            const description = values.description || 'Instant Meeting'

            await call.getOrCreate({
                data: {
                    starts_at: startsAt,
                    custom: {
                        description
                    }
                }
            })
            setCallsDetails(call);
            if (!values.description) { // means instant meeting not scheduled
                router.push(`/meeting/${call.id}`)
            }
            toast({
                title: "Meeting Created",
            })
        } catch (error) {
            toast({
                title: "Failed to create meeting",
            })
        }
    }
    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callsDetails?.id}`
    return (
        <section className='grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-4'>
            <HomeCard
                img='/icons/add-meeting.svg'
                title='New Meeting'
                description='Start an instant Meeting'
                handleClick={() => { setMeetingState('isInstantmeeting') }}
                classes="bg-orange-1"
            />
            <HomeCard img='/icons/schedule.svg'
                title='Schedule Meeting'
                description='Plan your Meeting'
                handleClick={() => { setMeetingState('isScheduleMeeting') }} classes="bg-blue-1" />

            <HomeCard img='/icons/recordings.svg'
                title='View Recordings'
                description='Check out your Recordings'
                handleClick={() => router.push('/recordings')} classes="bg-purple-1" />
            <HomeCard img='/icons/join-meeting.svg'
                title='Join Meeting'
                description='via invitation link'
                handleClick={() => { setMeetingState('isJoiningMeeting') }} classes="bg-yellow-1" />
            {/* Instant meeting model */}
            <MeetingModal
                isOpen={meetingState === 'isInstantmeeting'}
                onClose={() => setMeetingState(undefined)}
                title="Start an Instant Meeting"
                className="text-center"
                buttonText="Start Meeting"
                handleClick={createMeeting}
            />

            {/* Schedule Meeting Modal */}
            {(!callsDetails) ? (
                <MeetingModal
                    isOpen={meetingState === 'isScheduleMeeting'}
                    onClose={() => setMeetingState(undefined)}
                    title="Create Meeting"
                    className="text-center"
                    handleClick={createMeeting}
                >
                    <div className='flex flex-col gap-2.5'>
                        <label className='text-base text-normal leading-[22px] text-sky-2'>Add a description</label>
                        <Textarea className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0' onChange={(e) => { setValues({ ...values, description: e.target.value }) }} />
                    </div>
                    <div className='flex flex-col gap-2.5'>
                        <label className='text-base text-normal leading-[22px] text-sky-2'>Select Date and Time</label>
                        <ReactDatepicker
                            selected={values.dateTime}
                            onChange={(date) => { setValues({ ...values, dateTime: date! }) }}
                            showTimeSelect
                            timeFormat='HH:mm'
                            timeIntervals={15}
                            timeCaption='time'
                            dateFormat='MMMM d, yyyy h:mm aa'
                            className='w-full rounded bg-dark-3 p-2 focus:outline-none'
                        />
                    </div>
                </MeetingModal>
            ) : (<MeetingModal
                isOpen={meetingState === 'isScheduleMeeting'}
                onClose={() => setMeetingState(undefined)}
                className="text-center"
                title="Meeting Created"
                image='/icons/checked.svg'
                buttonIcon='/icons/copy.svg'
                buttonText="Copy Meeting Link"
                handleClick={() => {
                    navigator.clipboard.writeText(meetingLink)
                    toast({ title: 'Link Copied' })
                }}

            />)}
        </section>
    )
}

export default MeetingTypeList