import AttachmentPreviewModal from '@/Components/App/AttachmentPreviewModal';
import ConversationHeader from '@/Components/App/ConversationHeader';
import MessageInput from '@/Components/App/MessageInput';
import MessageItem from '@/Components/App/MessageItem';
import { useEventBus } from '@/EventBus';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ChatLayout from '@/Layouts/ChatLayout';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/solid';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
      
function Home({selectedConversation, messages }) {

    const {on} = useEventBus();
    const [localMessages, setLocalMessages] = useState([])
    const [noMoreMessage, setNoMoreMessage] = useState(false)
    const [scrollFromBottom, setScrollFromBottom] = useState(false)
    const [showAttachmentPreview, setShowAttachmentPreview] = useState(false)
    const [previewAttachment, setPreviewAttachment] = useState({})
    const messagesCtrRef = useRef(null)
    const loadMoreIntersect = useRef(null)

    
    const messageCreated =(message)=>{
        // console.log(message)
        if(noMoreMessage) {
            return;
        }
        // console.log('GROUP MESSAGE', message, selectedConversation)
        if(selectedConversation && 
            selectedConversation.is_group && 
            selectedConversation.id == message.group_id
        ) {
            console.log('group_id')
            setLocalMessages((preMessages)=>[...preMessages, message])
        }
        if(selectedConversation  && 
            selectedConversation.is_user &&
            (selectedConversation.id == message.sender_id 
            || selectedConversation.id== message.receiver_id)
        ) {
            // console.log('first')
            setLocalMessages((preMessages)=>[...preMessages, message])
        }
    }
    const messageDeleted =({message}) =>{
       
        if(selectedConversation && 
            selectedConversation.is_group && 
            selectedConversation.id == message.group_id
        ) {
            console.log('group_id')
            setLocalMessages((preMessages)=>{
                return preMessages.filter((m)=>m.id !== message.id)
            })
        }
        if(selectedConversation  && 
            selectedConversation.is_user &&
            (selectedConversation.id == message.sender_id 
            || selectedConversation.id== message.receiver_id)
        ) {
            // console.log('first')
            setLocalMessages((preMessages)=>{
                return preMessages.filter((m)=>m.id !== message.id)
            })        
        }
    }
    
    const loadMoreMessage  = useCallback(()=>{
        const firstMessage = localMessages[0]
        axios
            .get(route('load.older.message', firstMessage.id))
            .then(({data})=>{
                // console.log(data)
                if(data.data.length===0) {
                    setNoMoreMessage(true)
                    return
                }
                const scrollHeight = messagesCtrRef.current.scrollHeight
                const scrollTop = messagesCtrRef.current.scrollTop
                const clientHeigh = messagesCtrRef.current.clientHeigh
                const tmpScrollFromBotton = scrollHeight - scrollTop - clientHeigh
                console.log(tmpScrollFromBotton)
                setScrollFromBottom(scrollHeight - scrollTop - clientHeigh)
                setLocalMessages((preMessages)=>{
                    return [...data.data.reverse(), ...preMessages]
                })
            })
        
    },[localMessages, noMoreMessage])

    useEffect(()=>{
        
        setTimeout(()=>{
            if(messagesCtrRef.current) {
                messagesCtrRef.current.scrollTop = messagesCtrRef.current.scrollHeight
            }
        },10)

        const ofCreated= on('message.created', messageCreated)
        const ofDeleted= on('message.deleted', messageDeleted)

        
        setScrollFromBottom(0)
        setNoMoreMessage(false)
        return () => {
            ofCreated()
            ofDeleted()
        }
    }, [selectedConversation])
  
 
    
    useEffect(()=>{
        setLocalMessages(messages ? messages.data.reverse() :[])
    },[messages])
    
    useEffect(()=>{
        if(messagesCtrRef.current && scrollFromBottom !== null) {
            messagesCtrRef.current.scrollTop = 
                messagesCtrRef.current.scrollHeight -
                messagesCtrRef.current.offsetHeight -
                scrollFromBottom
        }
        if(noMoreMessage) {
            return
        }
        const observer = new IntersectionObserver(
            (entries) =>
                entries.forEach((entry)=>
                    entry.isIntersecting && loadMoreMessage()
                ),
            {
                rootMargin: "0px 0px 250px 0px"  
            }
        )
        if(loadMoreIntersect.current) {
            setTimeout(()=>{
                observer.observe(loadMoreIntersect.current)
            },100)
        }
        return () =>{
            observer.disconnect()
        }
    },[localMessages]) 

    const onAttachmentClick = (attachments, ind) =>{
        setPreviewAttachment({
            attachments,
            ind
        })
        setShowAttachmentPreview(true)
    }
    // console.log('local', localMessages)
    return (
        <>
            {/* <main>  */}
            {!messages && (
                <div className="flex flex-col items-center justify-center h-full gap-8 text-center dark:bg-gray-900 opacity-35">
                    <div className="p-16 text-2xl text-white md:text-4xl">
                        Please select the conversation to see message
                    </div>
                    <ChatBubbleLeftIcon className='inline-block w-32 h-32 text-white'/>
                    
                </div>
            )}
            {messages && (
                <>
                    <ConversationHeader selectedConversation={selectedConversation} />
                    <div  
                        className="flex-1 p-5 overflow-y-auto dark:bg-gray-700 "
                        ref={messagesCtrRef}
                    >  
                        {localMessages.length ===0 &&(
                            <div className="flex items-center justify-center h-full">
                                <div className="text-lg text-white">
                                    No Message
                                </div>
                            </div>
                        )}
                        {localMessages.length > 0 &&(
                            <div className="flex flex-col flex-1">
                                <div className="" 
                                    ref={loadMoreIntersect}
                                ></div>
                               {localMessages.map((message)=>(
                                    <MessageItem 
                                        key={message.id}
                                        message={message} 
                                        attachmentClick = {onAttachmentClick}
                                        
                                    /> 
                               ))}
                            </div>
                        )}
                    </div>
                    <MessageInput conversation ={selectedConversation} />
                </>
            )}
            {/* </main> */}
            {previewAttachment.attachments && (
                <AttachmentPreviewModal
                    attachments={previewAttachment.attachments}
                    index={previewAttachment.ind}
                    show={showAttachmentPreview}
                    onClose={()=>setShowAttachmentPreview(false)}
                />
            )}
        </>
    );
}

Home.layout =(page) =>{
    return (
        <AuthenticatedLayout>
            <ChatLayout children={page}></ChatLayout>
        </AuthenticatedLayout>
    )
}

export default Home;