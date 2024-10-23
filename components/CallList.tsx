// // @ts-ignore
// 'use client'
// import { useGetCalls } from '@/hooks/useGetCalls'
// import { CallRecording } from '@stream-io/node-sdk';
// import { Call, CallRecordingListHeader } from '@stream-io/video-react-sdk';
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react'
// import MeetingCard from './MeetingCard';
// import Loader from './Loader';
// import { toast } from '@/hooks/use-toast';

// const CallList = ({ type }: { type: 'ended' | 'upcomming' | 'recordings' }) => {
//     const { endedCalls, upcommingCalls, callRecordings, isLoading } = useGetCalls();
//     const router = useRouter();
//     const [recordings, setRecordings] = useState<CallRecording[]>([])

//     // Fetch recordings only if type is 'recordings'
//     useEffect(() => {
//         try {
//             const fetchRecordings = async () => {
//                 const callData = await Promise.all(callRecordings.map((meeting) => meeting.queryRecordings()))
//                 const recording = callData.filter((call) => call.recordings.length > 0).flatMap((call) => call.recordings)
//                 setRecordings(recording) // Use the correct variable here, not CallRecordingListHeader
//             }

//             if (type === 'recordings') fetchRecordings();
//         } catch (error) {
//             toast: ({ title: "Try Again Later" })
//         }

//     }, [type, callRecordings])

//     // Helper functions for getting the appropriate calls and no-calls message
//     const getCalls = () => {
//         switch (type) {
//             case 'ended':
//                 return endedCalls;
//             case 'recordings':
//                 return recordings;
//             case 'upcomming':
//                 return upcommingCalls;
//             default:
//                 return [];
//         }
//     }
//     const getNoCallsMessage = () => {
//         switch (type) {
//             case 'ended':
//                 return 'No previous Calls';
//             case 'recordings':
//                 return 'No Recording Available';
//             case 'upcomming':
//                 return 'No Upcoming Calls';
//             default:
//                 return '';
//         }
//     }

//     // Get calls and no-calls message
//     const calls = getCalls();
//     const noCalls = getNoCallsMessage();

//     return (
//         <div className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
//             {isLoading ? (
//                 <Loader />
//             ) : (
//                 calls && calls.length > 0 ? (
//                     calls.map((meeting: Call | CallRecording, idx) => (
//                         <MeetingCard
//                             key={(meeting as Call).id}
//                             icon={type === 'ended' ? '/icons/previous.svg' : type === 'upcomming' ? 'icons/upcoming.svg' : '/icons/recordings.svg'}
//                             title={(meeting as Call).state?.custom?.description?.substring(0, 20) || meeting?.filename?.substring(0, 20) || 'Personal Meeting'}
//                             date={(meeting as Call).state?.startsAt?.toLocaleString() || meeting.start_time?.toLocaleString()}
//                             isPreviousMeeting={type === 'ended'}
//                             buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
//                             handleClick={type === 'recordings' ? () => router.push(`${meeting.url}`) : () => router.push(`/meeting/${meeting.id}`)}
//                             link={type === 'recordings' ? meeting.url : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`}
//                             buttonText={type === 'recordings' ? 'Play' : 'Start'}
//                         />
//                     ))
//                 ) : (
//                     <h1>{noCalls}</h1>
//                 )
//             )}
//         </div>
//     )
// }

// export default CallList;

'use client'
import { useGetCalls } from '@/hooks/useGetCalls'
import { CallRecording } from '@stream-io/node-sdk';
import { Call } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import MeetingCard from './MeetingCard';
import Loader from './Loader';
import { toast } from '@/hooks/use-toast';

const CallList = ({ type }: { type: 'ended' | 'upcomming' | 'recordings' }) => {
    const { endedCalls, upcommingCalls, callRecordings, isLoading } = useGetCalls();
    const router = useRouter();
    const [recordings, setRecordings] = useState<CallRecording[]>([])

    // Fetch recordings only if type is 'recordings'
    useEffect(() => {
        const fetchRecordings = async () => {
            try {
                if (callRecordings && callRecordings.length > 0) {
                    const callData = await Promise.all(callRecordings.map((meeting) => meeting.queryRecordings()));
                    const recording = callData.filter((call) => call.recordings.length > 0).flatMap((call) => call.recordings);
                    setRecordings(recording);
                }
            } catch (error) {
                console.log(error)
                toast({ title: "Try Again Later" });
            }
        };

        if (type === 'recordings') fetchRecordings();
    }, [type, callRecordings]);

    // Helper functions for getting the appropriate calls and no-calls message
    const getCalls = () => {
        switch (type) {
            case 'ended':
                return endedCalls;
            case 'recordings':
                return recordings;
            case 'upcomming':
                return upcommingCalls;
            default:
                return [];
        }
    };

    const getNoCallsMessage = () => {
        switch (type) {
            case 'ended':
                return 'No previous Calls';
            case 'recordings':
                return 'No Recording Available';
            case 'upcomming':
                return 'No Upcoming Calls';
            default:
                return '';
        }
    };

    // Get calls and no-calls message
    const calls = getCalls();
    const noCalls = getNoCallsMessage();

    return (
        <div className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
            {isLoading ? (
                <Loader />
            ) : (
                calls && calls.length > 0 ? (
                    calls.map((meeting: Call | CallRecording) => (
                        <MeetingCard
                            key={(meeting as Call).id} // Fallback to idx if meeting.id doesn't exist
                            icon={type === 'ended' ? '/icons/previous.svg' : type === 'upcomming' ? 'icons/upcoming.svg' : '/icons/recordings.svg'}
                            title={(meeting as Call).state?.custom?.description?.substring(0, 20) || meeting?.filename?.substring(0, 20) || 'Personal Meeting'}
                            date={(meeting as Call).state?.startsAt?.toLocaleString() || meeting.start_time?.toLocaleString()}
                            isPreviousMeeting={type === 'ended'}
                            buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
                            handleClick={type === 'recordings' ? () => router.push(`${meeting.url}`) : () => router.push(`/meeting/${meeting.id}`)}
                            link={type === 'recordings' ? meeting.url : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`}
                            buttonText={type === 'recordings' ? 'Play' : 'Start'}
                        />
                    ))
                ) : (
                    <h1>{noCalls}</h1>
                )
            )}
        </div>
    );
}

export default CallList;
