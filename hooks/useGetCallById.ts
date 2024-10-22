import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useEffect, useState } from "react"

export const useGetCallById = (id: string | string[]) => {
    const [call , setCall] = useState<Call>()
    const [isCallloading , setIsCallLoading] = useState(true)

    const client = useStreamVideoClient();

    useEffect(() => {
        if (!client) return;
        const loadCalls = async () => {
            const { calls } = await client.queryCalls({
                filter_conditions: {
                    id
                }
            })
            if(calls.length >0 ) setCall(calls[0])
            setIsCallLoading(false);
        }
        loadCalls()
    },[client ,id ])


    return {call , isCallloading}
}