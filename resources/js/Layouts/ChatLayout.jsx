import { router, usePage } from '@inertiajs/react'
import React, { useContext, useEffect, useState } from 'react'
import AuthenticatedLayout from './AuthenticatedLayout'
import TextInput from '@/Components/TextInput'
import ConversationItem from '@/Components/App/ConversationItem'
import { PencilSquareIcon } from '@heroicons/react/24/solid'
import { useEventBus } from '@/EventBus'
import GroupModal from '@/Components/App/GroupModal'

function ChatLayout({ children}) {
  const page = usePage()
  const conversations = page.props.conversations
  const selectedConversation = page.props.selectedConversation
  const [localConversations, setLocalConversations] = useState([]);
  const [sortedConversations, setsortedConversations] = useState([]);
  const {on, emit} = useEventBus();
  const [onlineUsers, setOnlineUsers] = useState({});
  const [showGroupModal, setShowGroupModal] = useState(false);


  
  const onSearch = (e) => {
    const search  = e.target.value.toLowerCase();
    setLocalConversations(conversations.filter((conversation)=>{
      return (
        conversation.name.toLowerCase().includes(search) 
      )
    }))
  }
    
   
  const messageCreated = (message) =>{
    setLocalConversations((oldUsers)=>{
      return oldUsers.map((u)=>{
        // console.log(message, u)
        // debugger
        if(message.receiver_id && !u.is_group && 
          (u.id===message.sender_id || u.id ===message.receiver_id) 
        ) {
          u.last_message = message.message;
          u.last_message_date = message.created_at;
          return u;
        }
        if(message.group_id && u.is_group && u.id==message.group_id) {
          u.last_message = message.message;
          u.last_message_date = message.created_at
          return u;
        }
        
        return u;
        
      })
    })
  }

  const messageDeleted = ({prevMessage}) =>{
    if(!prevMessage) {
      return;
    }
    messageCreated(prevMessage)
  }
  
  useEffect(()=>{
    const offCreated= on('message.created', messageCreated)
    const offDeleted= on('message.deleted', messageDeleted)
    
    const offGroupDeleted= on('group.deleted', ({id, name})=>{
      setLocalConversations((oldUsers)=>{
        return oldUsers.filter((u)=> u.id != id)
      })
      emit('toast.show', `Group ${name} deleted`)
      if(selectedConversation && selectedConversation.is_group &&
        selectedConversation.id == id
      ) {
        router.visit(route('dashboard'))
      }
    })
    const offModalShow= on('GroupModal.show', ({group}) =>{
      setShowGroupModal(true)
    })

      return ()=>{
      offCreated()
      offDeleted()
      offModalShow()
      offGroupDeleted()

    }
  },[conversations])
   
  useEffect(()=>{
    setsortedConversations(
      localConversations.sort((a,b)=>{
        if(a.blocked_at && b.blocked_at) {
          return a.blocked_at > b.blocked_at ? 1 : -1;
        } else if(a.blocked_at) {
          return 1;
        } else if(b.blocked_at) {
          return -1;
        }
        if(a.last_message_date && b.last_message_date) {
          return b.last_message_date.localeCompare(
            a.last_message_date
          )
        } else if(a.last_message_date) {
          return -1;
        } else if(b.last_message_date) {
          return  1;
        } else {
          return 0;
        }
      })
    )
  }, [localConversations])

    useEffect(()=>{
      setLocalConversations(conversations)
    }, [conversations,sortedConversations])

    useEffect(()=>{
      Echo.join('online')
        .here((users)=> {
          const onlineUsersObj = Object.fromEntries(users.map((user)=> [user.id,user]))
          setOnlineUsers((prevOnlineUsers)=>{
            return {...prevOnlineUsers, ... onlineUsersObj}
          })
        })
        .joining((user)=>{
          setOnlineUsers((prevOnlineUsers)=> {
            const updatedUsers = {...prevOnlineUsers}
            // console.log('joining', updatedUsers, user)
            updatedUsers[user.id] = user;
          })
        })
        .leaving((user)=>{
          setOnlineUsers((prevOnlineUsers)=> {
            const updatedUsers = {...prevOnlineUsers}
            delete updatedUsers[user.id] 
            return updatedUsers;
          })       

        }).error((error)=>{
          console.error('error', error)
        });
        return ()=>{
          Echo.leave("online")
        }
          
    },[])
    const isUserOnline = (userId) => onlineUsers[userId]
    // console.log(onlineUsers)

  return (
    <>
    <div className="flex flex-1 w-full overflow-hidden">
      <div className={
        `transition-all w-full sm:w-[200px] md:w-[300px] bg-slate-800 flex  
         flex-col overflow-hidden ${
          selectedConversation ? "-ml-[100%] sm:ml-0" : ""
         }`   
      }>
        <div className="flex items-center justify-between px-3 py-2 text-xl font-medium text-gray-200">
          My Conversations
          <div className="tooltip tooltip-left" data-tip="Create new Group">
            <button className="text-gray-400 hover:text-gray-200"
              onClick={(ev)=>setShowGroupModal(true)}
            >
              <PencilSquareIcon className="inline-block w-4 h-4 ml-2"/>
            </button>
          </div>
        </div>
        <div className="p-3">
          <TextInput 
            onKeyUp={onSearch}
            placeholder="Filter users and groups"
            className="w-full"
          />
        </div>
        <div className="flex-1 overflow-auto">
          {sortedConversations && sortedConversations.map((conversation)=>(
            <ConversationItem 
            key ={`
              ${conversation.is_group ? "group_":"user_"}
              ${conversation.id}
            `}
            conversation = {conversation}
            online = {!!isUserOnline(conversations.id)}
            selectedConversation = {selectedConversation}
            />
            
          ))
          }
        </div>
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        {children}
      </div>
    </div>
    <GroupModal show={showGroupModal} onClose={()=>setShowGroupModal(false)}/>
    </>
  )
}
 
export default ChatLayout