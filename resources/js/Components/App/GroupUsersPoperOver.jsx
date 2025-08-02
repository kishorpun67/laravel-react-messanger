import { UserIcon } from '@heroicons/react/24/solid'
import { Link } from '@inertiajs/react'
import React, { use } from 'react'
import UserAvatar from './UserAvatar'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'

function GroupUsersPoperOver({users=[]}) {
    return (
        <>   
        <Popover className={`relative`}>
            {/* {({open})=>()} */}
            <PopoverButton className="block font-semibold text-gray-400 text-sm/6 focus:outline-none data-active:text-white data-focus:outline data-focus:outline-white data-hover:text-white">
                <UserIcon className='w-4'/>
            </PopoverButton>
            <PopoverPanel
                transition
                anchor="bottom"
                className="divide-y z-50 right-0  w-[200px] px-4 divide-white/5 rounded-xl bg-white/5 text-sm/6 transition duration-200 ease-in-out [--anchor-gap:--spacing(5)] data-closed:-translate-y-1 data-closed:opacity-0"
            >
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                    <div className="py-2 text-white bg-gray-800">
                      
                        {users.map((user)=>(
                            <Link 
                                href={route('chat.user', user.id)}
                                key={user.id}
                                className='flex items-center gap-2 px-3 py-2 hover:bg-black/30'
                                >
                                    <UserAvatar user={user} />
                                    <div className="text-xs">
                                        {user.name}
                                    </div>
                                </Link>
                        ))}
                       
                    </div>
                </div>
            </PopoverPanel>
        </Popover>
        </>
    )
}

export default GroupUsersPoperOver