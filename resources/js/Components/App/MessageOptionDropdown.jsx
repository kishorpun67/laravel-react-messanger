import React from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
  ArchiveBoxXMarkIcon,
  ChevronDownIcon,
  LockOpenIcon,
  PencilIcon,
  Square2StackIcon,
  TrashIcon,
  LockClosedIcon
  
} from '@heroicons/react/16/solid'
import axios from 'axios'
import { EllipsisVerticalIcon, ShieldCheckIcon } from '@heroicons/react/24/solid'
import { useEventBus } from '@/EventBus'

function MessageOptionDropdown({ message}) {
  
  const {emit} = useEventBus()
  const onMessageDelete = () =>{
    // console.log(message)
    // console.log('delete.message')
    axios
      .delete(route('message.destroy', message.id))
      .then((res)=>{
        console.log(res.data, 'message option dropdown')
        emit('message.deleted', {message, prevMessage:res.data.message})
      })
      .catch((error)=>{
        console.error(error)
      })
  }
  

  return (
    <div className='absolute z-10 text-gray-100 -translate-y-1/2 right-full top-1/2'>
        <Menu as="div" className="relative inline-block text-left">
                <MenuButton className={`flex justify-center items-center w-8 h-8 rounded-full hover:bg-black/40`}>
                    {/* Menu */}
                    <EllipsisVerticalIcon className='h-6 '/>
                    {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                    </svg> */}
                </MenuButton>
            <MenuItems
            transition
            anchor="bottom end"
            className="absolute right-0 z-50 w-48 mt-2 bg-gray-800 rounded-md shadow-lg"
            >
                {/* {({active})=>( */}
                   
                    <MenuItem className="left-0"> 
                        <button 
                            onClick={onMessageDelete}
                            className={
                                `
                               bg-black/30 text-white
                                group flex text-sm
                                w-full items-center rounded-md px-2 py-2`}
                                
                        > 
                            <>
                                <TrashIcon className='w-4 h-4 mr-2'/>
                                Delete
                            </>
                       
                        </button>
                    
                    </MenuItem>
                

                  
            
            </MenuItems>
        </Menu>
    </div>
  )
}

export default MessageOptionDropdown