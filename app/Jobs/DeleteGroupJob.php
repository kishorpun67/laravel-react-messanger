<?php

namespace App\Jobs;

use App\Events\GroupDeleted;
use App\Models\Group;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class DeleteGroupJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public Group $group)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        
        $id = $this->group->id;
        $name = $this->group->name;
        $this->group->last_message_id = null;
        $this->group->save();


        // iterate over all messages and delete then 
        $this->group->messages->each->delete();


        // romve all user from the group 
        $this->group->users()->detach();

        // delete the group 
        // dd($name, $id);
        $this->group->delete();

        GroupDeleted::dispatch($id, $name);
    }
}
