import React, { useState } from 'react'
import { UserGroupIcon } from '@heroicons/react/24/solid'
function GroupAvatar({}) {
    
  return (
    <>
        <div className={`avatar placeholder`}>
            <div className={`bg-gray-400 text-gray-800 rounded-full w-8`}>
                <span className="flex items-center justify-center text-xl align-items-center">
                    <UserGroupIcon className='w-4'/>
                </span>
            </div>
        </div>
    </>
  )
}

export default GroupAvatar