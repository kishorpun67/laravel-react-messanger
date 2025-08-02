import { isAudio, isImage, isPDF, isPreviewable, isVideo } from '@/helpers/helpers';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { ChevronLeftIcon, ChevronRightIcon, PaperClipIcon, XMarkIcon } from '@heroicons/react/24/solid';
import React, { Fragment, useEffect, useMemo, useState } from 'react'

function AttachmentPreviewModal({attachments, index, show=false, onClose=()=>{},}) {
    console.log(attachments)
    const [currentIndex, setCurrentIndex] = useState();
   
    const previewAttachments = useMemo(()=>{
        return attachments.filter((attachment)=>isPreviewable(attachment))
    },[attachments])
    const attachment = useMemo(()=>{
        return previewAttachments[currentIndex];
    },[attachments, currentIndex])

    const close = () =>{
        onClose()
    }

    const prev = () =>{
        if(currentIndex ===0) {
            return 
        }
        setCurrentIndex(currentIndex - 1)
    }
    const next = () =>{
        if(currentIndex === previewAttachments.length -1) {
            return 
        }
        setCurrentIndex(currentIndex + 1)

    }

    useEffect(()=>{
        setCurrentIndex(index)
    },[index])

    return (
        <>
            <Transition show={show} as ={Fragment} leave='duration-200'>
                <Dialog
                    as="div"
                    id="modal"
                    className={`relative z-50`}
                >
                    <TransitionChild
                        as={Fragment}
                        enter='ease-out duration-300'
                        enterFrom='opacity-0'
                        enterTo='opacity-100'
                        leave='ease-in duration-200'
                        leaveFrom='opacity-100'
                        leavTo = 'opacity-0'
                    >
                        <div className="fixed inset-0 bg-black/25"></div>
                    </TransitionChild>
                    <div className="fixed inset-0 overflow-y-auto">
                        <TransitionChild 
                            as={Fragment}
                            enter="ease-out duration-30"
                            enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                            enterTo='opacity-100'
                            leave='ease-in duration-200'
                            leaveFrom='opacity-100 translate-y-0 sm:scale-95'
                            leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                        >
                            <DialogPanel
                                className={`flex flex-col w-full h-full transform overflow-hidden bg-slate-800 text-left align-middle shadow-xl transition-all`}
                            >
                                <button onClick={close} className="absolute z-40 flex items-center justify-center w-10 h-10 text-gray-100 transition rounded-full right-3 top-3 hover:bg-black/10">
                                    <XMarkIcon className='w-6 h-6'/>
                                </button>
                                <div className="relative h-full group">
                                    {currentIndex > 0 && (
                                        <div onClick={prev} className="absolute z-30 flex items-center justify-center w-16 h-16 text-gray-100 -translate-y-1/2 rounded-full opacity-100 cursor-pointer bg-black/50 left-4 top-1/2">
                                            <ChevronLeftIcon className='w-12'/>
                                        </div>
                                    )}
                                    {currentIndex < previewAttachments.length - 1 && (
                                        <div 
                                            onClick={next}
                                            className="absolute z-30 flex items-center justify-center w-16 h-16 text-gray-100 -translate-y-1/2 rounded-full opacity-100 cursor-pointer bg-black/50 right-4 top-1/2"
                                        >
                                            <ChevronRightIcon className='W-12'/>
                                        </div>
                                    )}
                                    {attachment &&(
                                        <div className="flex items-center justify-center w-full h-full p-3">
                                            {
                                                isImage(attachment) && (
                                                    <img  src={attachment.url} alt="" className="max-w-full max-h-full" />
                                                )
                                            }
                                            {
                                                isVideo(attachment) && (
                                                    <div className="flex items-center">
                                                        <video src={attachment.url} controls autoPlay></video>
                                                    </div>
                                                )
                                            }
                                            {isAudio(attachment) && (
                                                <div className="relative flex items-center justify-center">
                                                    <audio src={attachment.url} controls autoPlay></audio>
                                                </div>
                                            )}
                                            {isPDF(attachment) &&(
                                                    <iframe src={attachment.url} frameborder="0" className="w-full h-full"></iframe>
                                                )
                                            }
                                            {!isPreviewable(attachment) &&(
                                                <div className="flex flex-col items-center justify-center p-32 text-gray-100">
                                                    <PaperClipIcon className='h-10 mb-3 W-10'/>
                                                    <small>{attachment.name}</small>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

export default AttachmentPreviewModal