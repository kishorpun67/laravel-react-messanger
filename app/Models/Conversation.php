<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    protected $fillable = [
        'user_id1',
        'user_id2',
        'last_message_id'
    ];

    public function lastMessage() 
    {
        return $this->belongsTo(Message::class, 'last_message_id');
    }

    public function user1() 
    {
        return $this->belongsTo(User::class, 'user_id1');

    }
    public function user2() 
    {
        return $this->belongsTo(User::class, 'user_id2');
    }

    public static function getCoversationsForSideBar(User $exceptUser) 
    {
        $users =  User::getUsersExceptUser($exceptUser);
        $groups = Group::getGroupsExceptUser($exceptUser);
        return $users->map(fn (User $user) => $user->toConversationArray())
        ->concat(
            $groups->map(fn (Group $group) => $group->toConversationArray())
        );
    }

    public static function updateConversationWithMessage($userId1, $userId2, $message)
    {
        // find conversation by user_id1 and user_id2 and update last message id 
        $conversation = Conversation::where(function($query) use ($userId1, $userId2) {
            $query->where('user_id1', $userId1)
            ->where('user_id2', $userId2);
        })->orWhere(function($query) use ($userId1, $userId2) {
            $query->where('user_id2', $userId1)
            ->where('user_id1', $userId2);
        })->first();

        // return ($conversation);
        // dd('here');
        if($conversation) {
            $conversation->update([ 'last_message_id' => $message->id]);
        } else  {
            Conversation::create([
                'user_id1' => $userId1,
                'user_id2' => $userId2,
                'last_message_id' =>$message->id
            ]);
        }
    }

 
}
