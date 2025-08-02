<?php

namespace App\Observers;

use App\Models\Conversation;
use App\Models\Group;
use App\Models\Message;
use Illuminate\Support\Facades\Storage;

class MessageObserver
{
    public function deleting(Message $message)
    {
        // iterate over teh message attachments and delete then from file system 
        $message->attachments->each(function($attachment) {
            // delete attachment file from file system save on public 
            $dir = dirname($attachment->path);
            Storage::disk('public')->deleteDirectory($dir);
        });
        // delete all attachements related to the message form the databse 
        $message->attachments()->delete();
 
        // update all attachments related to the message from the database 
        if($message->group_id) {
            $group = Group::where('last_message_id', $message->id)->first();
            if($group) {
                $prevMessage = Message::where('group_id', $message->group_id)
                    ->where('id', '!=', $message->id)
                    ->latest()
                    ->limit(1)
                    ->first();
                if($prevMessage) {
                    $group->last_message_id = $prevMessage->id;
                    $group->save();
                }
            }
        } else {
            $conversation = Conversation::where('last_message_id', $message->id)->first();

            // if the last message is the last message in the conversation 
            if($conversation) {
                $prevMessage = Message::where(function($query) use ($message) {
                        $query->where('sender_id', $message->sender_id)
                        ->where('receiver_id', $message->receiver_id);
                    })
                    ->orWhere(function ($subQuery) use ($message) {
                    $subQuery->where('sender_id', $message->receiver_id)
                     ->where('receiver_id', $message->sender_id);
                })
                ->where('id', '!=', $message->id)
                ->latest()
                ->limit(1)
                ->first();

                if($prevMessage) {
                    $conversation->last_message_id = $prevMessage->id;
                    $conversation->save();
                }
            
            }
        }
    }
}
