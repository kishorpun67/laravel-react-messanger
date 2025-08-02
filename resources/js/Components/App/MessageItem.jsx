import { usePage } from '@inertiajs/react'
import React from 'react'
import {FormatMessageDateLong, formatMessageDateShort} from "@/helpers/helpers"
import UserAvatar from './UserAvatar';
import ReactMarkdown from 'react-markdown';
import MessageAttachments from './MessageAttachments';
import MessageOptionDropdown from './MessageOptionDropdown';

function MessageItem({message, attachmentClick}) {
   

    // if (Object.keys(message.attachments).length > 0) {
    //     console.log(message.attachments[0].url)
    //   }

    const currentUser = usePage().props.auth.user;
    return (
        <>
            <div 
                className={
                    "chat " + (message.sender_id === currentUser.id ? "chat-end" : "chat-start")
                }
            >
                {<UserAvatar user={message.sender} />}
                <div className="text-white chat-header">
                    {message.sender_id != currentUser.id
                        ? message.sender.name
                        : ""
                    }
                    <time datetime="" className="ml-2 text-xs text-white opacity-50">
                        {FormatMessageDateLong(message.created_at)}
                    </time>
                </div> 
                <div className={
                    "chat-bubble "
                    + (message.sender_id===currentUser.id
                        ? "chat-bubble-info" 
                        :""
                    )
                }>
                    {message.sender_id == currentUser.id &&(
                        <MessageOptionDropdown message={message} />
                    )}
                    {/* {message.message} */}
                    <div className="chat-message">
                        <div className="chat-message-content">
                            <ReactMarkdown>{message.message}</ReactMarkdown>
                            <MessageAttachments
                                attachments={message.attachments}
                                attachmentClick={attachmentClick}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MessageItem