import { ArrowLeftIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Link, usePage } from '@inertiajs/react'
import React from 'react'
import UserAvatar from './UserAvatar';
import GroupAvatar from './GroupAvatar';
import axios from 'axios';
import GroupDescriptionPopover from './GroupDescriptionPopover';
import GroupUsersPoperOver from './GroupUsersPoperOver';
import { useEventBus } from '@/EventBus';

function ConversationHeader({selectedConversation}) {
    const user = usePage().props.auth.user;
    const {emit} = useEventBus()
    // console.log(selectedConversation, 'header ')

    const onDeleteGroup = () =>{
        if(!window.confirm('Are you sure you want to delete this group')) {
            return;
        }
        // console.log(selectedConversation.id,' select id')
        axios.delete(route('group.destroy', selectedConversation.id)).then((res)=>{
            emit("toast.show", res.data.message)
            // console.log(res.data)
        }).catch((error)=>{
            console.log(error)
        })
    }
  return (
    <>
        {selectedConversation &&(
            <div className="flex items-center justify-between p-3 border-b border-slate-700">
                <div className="flex items-center gap-3">
                    <Link
                        href={route('dashboard')}
                        className='inline-block sm:hidden'
                    >
                        <ArrowLeftIcon className='w-6'/>
                    </Link>
                    {selectedConversation.is_user && (
                        <UserAvatar user={selectedConversation}/>
                    )}
                    {selectedConversation.is_group &&  <GroupAvatar/> }
                    <h3>{selectedConversation.name}</h3>
                    {selectedConversation.is_group && (
                        <p className="text-xs text-gray-950">
                            {selectedConversation.users.length} members
                        </p>
                    )}
                </div>
                {selectedConversation.is_group &&(
                    <div className="flex gap-3">
                        <GroupDescriptionPopover description={selectedConversation.description} />
                        <GroupUsersPoperOver users={selectedConversation.users} />
                        {selectedConversation.owner_id == user.id &&(
                            <>
                                <div className="tooltip tooltip-left" data-tip="Edit Group">
                                    <button 
                                        className="text-gray-400 hover:text-gray-200" 
                                        onClick={(ev)=>
                                            emit('GroupModal.show', selectedConversation)
                                        }
                                    >
                                        <PencilSquareIcon className='w-4'/>
                                    </button>
                                </div>
                                <div className="tooltip tooltip-left" data-tip="Edit Group">
                                    <button 
                                        className="text-gray-400 hover:text-gray-200" 
                                        onClick={ onDeleteGroup
                                        }
                                    >
                                        <TrashIcon className='w-4'/>
                                    </button>
                                </div>
                            </>
                        )}

                            
                    </div>
                )}
            </div>
        )}
    </>
  )
}

export default ConversationHeader