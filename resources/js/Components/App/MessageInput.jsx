import { FaceSmileIcon, HandThumbDownIcon, HandThumbUpIcon, PaperAirplaneIcon, PaperClipIcon, PhotoIcon, XCircleIcon } from '@heroicons/react/24/solid'
import React, { Fragment, use, useEffect, useState } from 'react'
import NewMessageInput from './NewMessageInput'
import axios from 'axios'
import EmojiPicker from 'emoji-picker-react';
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import CustomAudioPlayer from './CustomAudioPlayer';
import AttachmentPreview from './AttachmentPreview';
import { isAudio, isImage } from '@/helpers/helpers';
import AudioRecorder from './AudioRecorder';
import { useEventBus } from '@/EventBus';

function MessageInput({conversation =null}) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const [newMessage, setNewMessage] = useState("")
    const [inputErrorMessage, setIputErrorMessage] = useState("")
    const [messageSending, setMessageSending] = useState(false)
    const [chosenFiles, setChosenFiels] = useState([])
    const [uploadProgress, setUploadProgess] = useState(0)
    
    const {emit} = useEventBus()
    const testpage = useEventBus()
    // console.log(testpage, 'test event bus')

    const onFileChange = (ev) =>{
        const files = ev.target.files 
        const upadateFiles = [...files].map((file)=>{
            return{
                file:file,
                url:URL.createObjectURL(file)
            }
        })

        setChosenFiels((prevFiles)=>{
            return [...prevFiles, ...upadateFiles]
        })
        // console.log(chosenFiles, 'chosenfile in side function')
    }
    const onSendClick = () => {
        // emit('toast.show', 'message send sucessfully')
        if(messageSending) return 
        
        if (newMessage.trim() === ""  && chosenFiles.length === 0) { // Require message
            setIputErrorMessage("Please provide a message or upload attachments.");
            setTimeout(() => setIputErrorMessage(""), 3000);
            return;
        }
    
        const formData = new FormData();
        if (newMessage.trim() !== "") {
            formData.append("message", newMessage);
        }
    
        // Append attachments
        if (chosenFiles) {
            // console.log(chosenFiles, 'this afetr click')
            chosenFiles.forEach((file)   => {
                formData.append("attachments[]", file.file);
            });
        }
    
        // Include receiver/group ID
        if (conversation.is_user) {
            formData.append("receiver_id", conversation.id);
        } else if (conversation.is_group) {
            formData.append("group_id", conversation.id);
        }
    
        setMessageSending(true);
        axios.post(route("message.store"), formData, {
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                'Content-Type': 'multipart/form-data' // Important for file uploads
            },
            onUploadProgress: (progressEvent) => {
                const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                // console.log(progress);
                setUploadProgess(progress)
            }
        }).then((response) => {
            setNewMessage("");
            setMessageSending(false);
            setUploadProgess(0)
            setChosenFiels([])
        }).catch((error) => {
            setMessageSending(false);
            setChosenFiels([])
            const message = error?.response?.data?.message
            setIputErrorMessage(message || "An error occured while sending mesaage")
        });
       
    };
    const onLikeClick = () =>{
        if(messageSending) {
            return 
        }
        // setNewMessage((preMessage)=>preMessage + '👍')

        const data = {
            message:"👍"
        }

        if (conversation.is_user) {
            data["receiver_id"] =conversation.id;
        } else if (conversation.is_group) {
            data["group_id"] = conversation.id;
        }
        // console.log(data)
        axios.post(route('message.store'), data)
    }
    const recordedAudioReady = (file, url) =>{
        setChosenFiels((prevFiles)=>[...prevFiles,{file,url}])
    }
  return (
    <>
        <div className="flex flex-wrap items-start py-3 border-t border-slate-700">
            <div className="flex-1 order-2 p-2 xs:flex-none xs:order-1">
                <button className="relative p-1 text-gray-400 hover:text-gray-300">
                    <PaperClipIcon className='w-6'/>
                    <input 
                        type="file" 
                        multiple
                        onChange={onFileChange}
                        className='absolute top-0 bottom-0 left-0 right-0 z-20 opacity-0 cursor-pointer'
                        placeholder='write some thing'
                    />
                </button>
                <button className="relative p-1 text-gray-400 hover:text-gray-300">
                    <PhotoIcon className='w-6'/>
                    <input 
                        type="file" 
                        multiple
                        onChange={onFileChange}
                        accept='image/*'
                        className='absolute top-0 bottom-0 left-0 right-0 z-20 opacity-0 cursor-pointer'
                        placeholder='write some thing'
                    />
                </button>
                <AudioRecorder fileReady={recordedAudioReady}/>
            </div>
            <div className="relative flex-1 order-1 px-3 xs:p-0 min-w-[220px] basis-full xs:basis-0 xs:order-2">
                <div className="flex">
                    <NewMessageInput 
                        value ={newMessage} 
                        onSend={onSendClick}
                        onChange={(ev)=>setNewMessage(ev.target.value)}
                    />
                    <button className="rounded-l-none btn btn-info" 
                        onClick={onSendClick}
                        disabled={messageSending}
                    >
                        {/* {messageSending  && (
                            <span className="loading loading-spinner loading-xs"></span>
                        )} */}
                        <PaperAirplaneIcon className='w-6'/>
                        <span className="hidden sm:inline">Send</span>
                    </button>
                </div>
                {
                    !!uploadProgress && (
                        <progress 
                            className="progress progress-info w-ful"
                            value={uploadProgress}
                            max={`100`}
                        >
                        </progress>
                    )
                }
                {
                    inputErrorMessage && (
                        <p className="text-red-400 txt-sx">{inputErrorMessage}</p>
                    )
                }
                <div className="flex flex-wrap gap-1 mt-2">
                    {chosenFiles.map((file)=>(
                        <div className={`relative  flex justify-between cursor-pointer` +
                            (!isImage(file.file)?  "w-[240px]":"")
                        }
                            key={file.file.name}
                        >
                            {isImage(file.file) && (
                                <img 
                                src={file.url} 
                                alt="" 
                                className="object-cover w-16 h-16" />
                            )}
                            {isAudio(file.file) && (
                                <CustomAudioPlayer 
                                    file={file}
                                    showVolume={false}
                                
                                />
                            )}
                            {!isAudio(file.file) && !isImage(file.file) && (
                                <AttachmentPreview
                                    file={file}
                                />
                            )}
                            <button 
                                className="absolute z-10 w-6 text-gray-300 bg-gray-800 rounded-full -right-2 -top-2 hover:text-gray-100"
                                onClick={()=>
                                    setChosenFiels(
                                        chosenFiles.filter((f)=>f.file.url= file.file.url)
                                    )
                                }
                            >
                                <XCircleIcon className='w-6'/>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex order-3 p-2 xs:order-3">
                <Popover className={
                    'relative'
                }>
                    <PopoverButton className={'p-1 text-gray-400 hover:text-gray-300'}>
                    <FaceSmileIcon className='w-6 h-6'/>

                    </PopoverButton>
                    <PopoverPanel className={'absolute z-10 right-0 bottom-full'}>
                        <EmojiPicker className='dark' onEmojiClick={ev =>setNewMessage(newMessage + ev.emoji)}>
                            
                        </EmojiPicker>
                    </PopoverPanel>
                </Popover>
                {/* <button className="p-1 text-gray-400 hover:text-gray-300">
                </button> */}
               
                <button  onClick={onLikeClick} className="p-1 text-gray-400 hover:text-gray-300">
                    <HandThumbUpIcon className='w-6 h-6'/>
                </button>
                {/* <EmojiPicker/> */}
                {/* <Fragment */}
                {/* <Popover/> <Transition/> */}
            </div>
        </div>
    </>
  )
}


export default MessageInput