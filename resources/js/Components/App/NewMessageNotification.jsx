import { useEventBus } from '@/EventBus'
import React, { useEffect, useState } from 'react'
import {v4 as uuidv4} from 'uuid'
import UserAvatar from './UserAvatar';
import { Link } from '@inertiajs/react';
function NewMessageNotification({message}) {
    const [toasts, setToasts] = useState([])
    const {on} = useEventBus();
    useEffect(()=>{
      on('newMessageNotification', ({message, user, group_id})=>{
        const uuid = uuidv4()
        setToasts((oldToasts)=>[...oldToasts, {message, uuid, user, group_id}])
        setTimeout(()=>{
           setToasts((oldToasts)=>oldToasts.filter((toast)=>toast.uuid !=uuid)) 
        },5000)
      })  
    },[on])
    return (
        <>
            <div className="toast toast-top toast-center  min-w-[280px]">
            { toasts.map((toast, index)=>(
                <div key={toast.uuid} className="px-4 py-3 text-gray-100 rounded-md alert alert-success">
                    <Link href={
                        toast.group_id 
                            ? route('chat.group', toast.group_id)
                            :route('chat.user', toast.user.id)
                    }>
                        <UserAvatar user={toast.user}/>
                        <span>{toast.message}</span>
                    </Link>
                </div>
            ))  
                
            }
            </div>
        </>
    )
}

export default NewMessageNotification