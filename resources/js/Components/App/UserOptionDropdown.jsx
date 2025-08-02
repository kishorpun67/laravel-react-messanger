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

function UserOptionDropdown({conversation}) {
    const changeUserRole = () =>{
        console.log('change user role')
        if(!conversation.is_user) {
            return;
        }
        axios
            .post(route("user.change.role", conversation.id))
            .then((res)=>{
                console.log(res)
            })
            .catch((err) =>{
                console.log(err)
            })
    }
    
    const onBlockUser = () =>{
        console.log('Block User') 
        if(!conversation.is_user){
            return 
        }
    
        axios
            .post(route("user.block.unblock", conversation.id))
            .then((res)=>{
                console.log(res)
            })
            .catch((err)=>{
                console.log(err)
        })
    }
  return (
    <>
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
                   
                    <MenuItem> 
                        <button 
                            onClick={()=>onBlockUser()}
                            className={
                                `
                               bg-black/30 text-white
                                group flex text-sm
                                w-full items-center rounded-md px-2 py-2`}
                                
                        > {conversation.blocked_at && (
                            <>
                                <LockOpenIcon className='w-4 h-4 mr-2'/>
                                Unblock User
                            </>
                        )}
                        {!conversation.blocked_at && (
                            <>
                                <LockClosedIcon className='w-4 h-4 mr-2'/>
                                Block User
                            </>
                        )}
                        </button>
                    
                    </MenuItem>
                

                    <MenuItem> 
                        <button 
                            onClick={()=>changeUserRole()}
                            className= {`bg-black/30 text-white
                            group flex text-sm
                            w-full items-center rounded-md px-2 py-2`}
                            
                        > {conversation.is_admin && (
                            <>
                                <UserIcon className='w-4 h-4 mr-2'/>
                                Make Regular User
                            </>
                        )}
                        {!conversation.is_admin && (
                            <>
                                <ShieldCheckIcon className='w-4 h-4 mr-2'/>
                                Make Admin
                            </>
                        )}
                        
                        </button>

                    </MenuItem>
            
            </MenuItems>
        </Menu>
    </>
  )
}

export default UserOptionDropdown