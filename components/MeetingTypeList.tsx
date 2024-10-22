"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModal from './MeetingModal'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useToast } from "@/hooks/use-toast"

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
            if (!values.description) {
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
            {/* meeting model */}
            <MeetingModal
                isOpen={meetingState === 'isInstantmeeting'}
                onClose={() => setMeetingState(undefined)}
                title="Start an Instant Meeting"
                className="text-center"
                buttonText="Start Meeting"
                handleClick={createMeeting}
            />
        </section>
    )
}

export default MeetingTypeList