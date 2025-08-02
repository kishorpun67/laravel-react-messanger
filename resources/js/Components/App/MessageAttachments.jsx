import { isAudio, isImage, isPDF, isPreviewable, isVideo } from '@/helpers/helpers'
import { ArrowDownTrayIcon, PaperClipIcon, PlayCircleIcon } from '@heroicons/react/24/solid'
import React from 'react'

function MessageAttachments({attachments, attachmentClick}) {
    // console.log(attachments, 'test')
  return (
    <>
        {attachments.length > 0  &&(
            <div className="flex flex-wrap justify-end gap-1 mt-2">
                {attachments.map((attachment, ind)=>(
                    <div 
                        key={attachment.id}
                        onClick={(ev)=>attachmentClick(attachment, ind)}
                        className={`relative flex flex-col items-center justify-center text-gray-500 cursor-pointer group`
                        + (isAudio(attachment) ? "w-48":"w-32 aspect-square bg-blue-100")
                    }>
                        {!isAudio(attachment) &&(
                            <a  
                                href={attachment.url}
                                download
                                onClick={(ev)=>ev.stopPropagation()}
                                className="absolute top-0 right-0 z-20 flex items-center justify-center w-8 h-8 text-gray-100 transition-all bg-gray-700 rounded opacity-100 cursor-pointer group-hover:opacity-100 hover:bg-gray-800"
                            >
                                <ArrowDownTrayIcon className='w-4 h-4'/>
                            </a>
                        )}
                        {isImage(attachment) && (
                            <img src={attachment.url} alt="" className="object-contain aspect-square" />
                        )}
                        {isVideo(attachment) && (
                            <div className="relative flex items-center justify-center">
                                <PlayCircleIcon className='absolute z-20 w-16 h-16 text-white opacity-70'/>
                                <div className="absolute top-0 left-0 z-10 w-full h-full bg-black/50">
                                </div>
                                <video src={attachment.url}></video>
                            </div>
                        )}
                        {isAudio(attachment) && (
                            <div className="relative flex items-center justify-center">
                                <audio 
                                    src={attachment.url}
                                    controls
                                ></audio>
                            </div>
                        )}
                        {isPDF(attachment) && (
                            <div className="relative flex items-center justify-center">
                                <div className="absolute top-0 bottom-0 left-0 right-0">
                                </div>
                                <iframe src={attachment.url}  className="w-full h-full"></iframe>
                            </div>
                        )}
                        {!isPreviewable(attachment) && (
                            <a 
                                href={attachment.url}
                                className="flex flex-col items-center justify-center"
                                download
                                onClick={(ev) =>ev.stopPropagation()}
                            >
                                <PaperClipIcon className='w-10 h-10 mb-3'/>
                                <small className='text-center'>{attachment.name}</small>
                            </a>
                        )}
                    </div>
                ))}
            </div>
        )}
    </>
  )
}

export default MessageAttachments