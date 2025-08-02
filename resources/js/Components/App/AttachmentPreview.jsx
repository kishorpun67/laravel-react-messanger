import { formatBytes, isPDF, isPreviewable } from '@/helpers/helpers'
import { PaperClipIcon } from '@heroicons/react/24/solid'
import React from 'react'

function AttachmentPreview({file}) {
    // console.log(typeo
    // console.log(isPDF(file.file), 'type')
  return (
    <>
        <div className="flex items-center w-full gap-2 px-3 rounded-md bg-slate-8000">
            <div>
                {/* hello world */}
                {isPDF(file.file) && <img src='/img/pdf.png' className='w-8' />}
                {!isPreviewable(file.file) && (
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-700 rounded">
                        <PaperClipIcon className='w-6'/>
                    </div>
                )}
            </div>
            <div className="flex-1 overflow-hidden text-gray-400 text-nowrap text-ellipsis">
                <h3>{file.file.name}</h3>
                <p className="text-xs">{formatBytes(file.file.size)}</p>
            </div>
        </div>
    </>
  )
}

export default AttachmentPreview