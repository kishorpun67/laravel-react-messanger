<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Conversation;
use App\Models\Message;
use SebastianBergmann\Type\NullType;

class HomeController extends Controller
{
    public function home() 
    {
        // User::whereNot('id', 2)->update(['avatar'=>'']);
        // return User::get();
        // return Conversation::latest()->first();

        // User::where('id','<', 20)->update(['avatar'=>""]);
        return Inertia::render('Home');

    }

    public function chatUser($user)
    {
        // return $user;
    }

    public function chatGroup($user) 
    {
        // return $user;
    }
}
