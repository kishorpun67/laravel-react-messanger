<?php

use App\Http\Controllers\GroupController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ProfileController;
use App\Models\Conversation;
use App\Models\Group;
use App\Models\Message;
use Carbon\Carbon;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::middleware(['auth', 'verified'])->group(function () {
  


    Route::get('/', [HomeController::class,  'home'])->name('dashboard');

    Route::get('/user/{user}', [MessageController::class,  'byUser'])->name('chat.user');
    Route::get('/group/{group}', [MessageController::class,  'byGroup'])->name('chat.group');
    Route::post('/message', [MessageController::class,  'store'])->name('message.store');
    Route::delete('/message/{message}', [MessageController::class,  'destroy'])->name('message.destroy');
    Route::get('/message/older/{message}', [MessageController::class,  'loadOlder'])->name('load.older.message');


    Route::post('/group', [GroupController::class,  'store'])->name('group.store');
    Route::patch('/group/{group}', [ProfileController::class, 'update'])->name('group.update');
    Route::delete('/group/{message}', [GroupController::class,  'destroy'])->name('group.destroy');


    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
