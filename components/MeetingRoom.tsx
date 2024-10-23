import { cn } from '@/lib/utils'
import { CallControls, CallingState, CallParticipantsList, CallStatsButton, PaginatedGridLayout, SpeakerLayout, useCallStateHooks } from '@stream-io/video-react-sdk'
import React, { useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutList, Users } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import EndCallButton from './EndCallButton'
import Loader from './Loader'


type callLayoutType = 'grid' | 'speaker-left' | 'speaker-right'
const MeetingRoom = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const isPersonalRoom = !!searchParams.get('personal')


    const [layout, setLayout] = useState<callLayoutType>('speaker-left')
    const [showParticipant, setShowParticipant] = useState(false)

    const { useCallCallingState } = useCallStateHooks();
    const callingState = useCallCallingState()

    if (callingState !== CallingState.JOINED) return <Loader />
    const CallLayout = () => {
        switch (layout) {
            case 'grid':
                return <PaginatedGridLayout />
            case 'speaker-left':
                return <SpeakerLayout participantsBarPosition='left' />
            default:
                return <SpeakerLayout participantsBarPosition='right' />
        }
    }
    return (
        <section className='relative h-screen w-full overflow-hidden pt-4 text-white'>
            <div className="relative flex size-full items-center justify-center ">
                <div className="flex size-full max-w-[1000px] items-center">
                    <CallLayout />
                </div>
                <div className={cn('h-[calc(100vh - 86px)] hidden ml-2', { 'show-block': showParticipant })}>
                    <CallParticipantsList onClose={() => setShowParticipant(false)} />
                </div>
            </div>
            <div className="fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap mb-3">
                <CallControls onLeave={() => router.push('/')} />

                {/* dropdown to change layout */}
                <DropdownMenu>
                    <div className='flex items-center '></div>
                    <DropdownMenuTrigger className='bg-[#19232d] cursor-pointer rounded-2xl px-4 py-2 hover:bg-[#4c535b]'><LayoutList size={20} /></DropdownMenuTrigger>
                    <DropdownMenuContent className='bg-dark-1 border-dark-1 text-white'>
                        {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item, index) => (
                            <div key={index}>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => setLayout(item.toLowerCase() as callLayoutType)}>{item}</DropdownMenuItem>
                                <DropdownMenuSeparator className='border-dark-1' />
                            </div>
                        ))}

                    </DropdownMenuContent>

                </DropdownMenu>
                <CallStatsButton />
                {/* to toggle participants */}
                <button type='button' onClick={() => setShowParticipant((prev) => !prev)}>
                    <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:[#4c535b]">
                        <Users size={20} className='text-white' />
                    </div>
                </button>

                {/* end call for non admin user */}
                {!isPersonalRoom && <EndCallButton />}
            </div>
        </section>
    )
}

export default MeetingRoom