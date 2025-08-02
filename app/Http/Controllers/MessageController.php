<?php

namespace App\Http\Controllers;

use App\Events\SocketMessage;
use App\Http\Requests\StoreMesageRequest;
use App\Http\Resources\MessageResource;
use App\Models\Conversation;
use App\Models\Group;
use App\Models\Message;
use App\Models\MessageAttachment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;

class MessageController extends Controller
{
    public function byUser(User $user) 
    {
        // return User::where('id',  '<', 10)->get();
        $messages = Message::where(function ($query) use ($user) {
            $query->where('sender_id', auth()->id())
                ->where('receiver_id', $user->id);
        })
        ->orWhere(function ($query) use ($user) {
            $query->where('sender_id', $user->id)
                ->where('receiver_id', auth()->id());
        })
        ->latest()
        ->paginate(10);
        // return $messages;
        // return $user->toConversationArray();
        // return MessageResource::collection($messages);
        return Inertia::render('Home', [
            'selectedConversation'=>$user->toConversationArray(),
            'messages' => MessageResource::collection($messages)
        ]);
    }

    public function byGroup(Group $group)
    {
        // return Message::latest()->get();
        $messages = Message::where('group_id', $group->id)
        ->latest()
        ->paginate(50);
        return Inertia::render('Home', [
            'selectedConversation'=>$group->toConversationArray(),
            'messages' => MessageResource::collection($messages)
        ]);
    }

    public function loadOlder(Message $message)
    {
        if($message->group_id)
        {
            $messages = Message::where('created_at', '<', $message->created_at)
            ->where('group_id', $message->group_id)
            ->latest()
            ->paginate(10);
        } else {
            $messages =Message::where('created_at', '<', $message->created_at)
            ->where(function($query) use ($message) {
                $query->where('sender_id', $message->sender_id)
                    ->where('receiver_id', $message->receiver_id);
            })
            ->orWhere(function ($subQuery) use ($message) {
                $subQuery->where('sender_id', $message->receiver_id)
                    ->where('receiver_id', $message->sender_id);
            })
            ->latest()
            ->paginate(10);        
        }

        return MessageResource::collection($messages);
    }
    public function store(StoreMesageRequest $request) 
    {
     
        $data = $request->all();

        // $data =  $request->validate();
        $data['sender_id'] = auth()->id();
        $receiverId = $data['receiver_id'] ?? null;
        $groupId = $data['group_id'] ?? null;
        $files = $data['attachments'] ?? [];
        // return dd($files);
        $message = Message::create($data);
        $attachments = [];
        if($files) {
            foreach($files as $file) {
                // return $file;
                $directory = 'attachments/'. Str::random(32);
                Storage::makeDirectory($directory);
                $model = [
                    'message_id' =>$message->id,
                    'name' =>$file->getClientOriginalName(),
                    'mime' =>$file->getClientMimeType(),
                    'size' => $file->getSize(),
                    'path' => $file->store($directory, 'public')
                ];
                $attachment = MessageAttachment::create($model);
                $attachments[] = $attachment;
            }
            $message->attachments = $attachments;
      
        }
    
      
        if($receiverId) {
            Conversation::updateConversationWithMessage($receiverId, auth()->id(), $message);
        } 
        if($groupId) {
            // return [$groupId, $message];
            Group::updateGroupWithMessage($groupId, $message);
        }

        SocketMessage::dispatch($message);

        return new MessageResource($message);

    }


    public function destroy(Message $message)
    {

        // return $message;
        if($message->sender_id !== auth()->id()) {
            return response()->json(['message'=>'Forbidden'], 403);
        }
        //check is message is the group message
        $group = null;
        $lastMessage =[];
        if($message->group_id) {
            $group = Group::where('id', $message->group_id)->first();
            if($group) {
                // return($group);
                $preMessage = Message::where('group_id', $message->group_id)
                    ->where('id', '!=', $message->id)
                    ->latest()
                    ->limit(1)
                    ->first();

                if($preMessage) {
                    $group->last_message_id = $preMessage->id;
                    $group->save();
                    $lastMessage = $group->lastMessage;
                } else {
                    $group->last_message_id = null;
                    $group->save();
                    // return $group;
                }
                // return $group;
            }
        } else {
            // return  $message;

            $conversation  = Conversation::where('last_message_id', $message->id)->first();
            if($conversation) {
                $preMessage = Message::where(function($query) use ($message) {
                    $query->where(function ($q) use ($message) {
                        $q->where('sender_id', $message->sender_id)
                          ->where('receiver_id', $message->receiver_id);
                    })->orWhere(function ($q) use ($message) {
                        $q->where('sender_id', $message->receiver_id)
                          ->where('receiver_id', $message->sender_id);
                    });
                })
                ->where('id', '!=', $message->id)
                ->latest()
                ->limit(1)
                ->first();
                

                if($preMessage) {
                    $conversation->last_message_id = $preMessage->id;
                    $conversation->save();
                    $lastMessage = $conversation->lastMessage;

                } else {
                    // return 'first';
                    $conversation->last_message_id = null;
                    $conversation->save();
                }
            }

        }
 
        $message->delete();
      
        return response()->json(['message'=> $lastMessage ?  new MessageResource($lastMessage):null]);
        
    }

  
}





