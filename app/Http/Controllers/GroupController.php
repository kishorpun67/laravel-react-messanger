<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGroupRequest;
use App\Http\Requests\UpdateGroupRequest;
use App\Jobs\DeleteGroupJob;
use App\Models\Group;

class GroupController extends Controller
{

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGroupRequest $request)
    {
        $data = $request->all();
        $user_ids = $data['user_ids'] ?? [] ;
        $description = $data['description'] ?? '' ;

        $group = Group::create([
            'name'=> $data['name'],
            'owner_id'=>auth()->id(),
            'description' => $description
        ]);
        $group->users()->attach(array_unique([$request->user()->id, ...$user_ids]));
        return redirect()->back();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGroupRequest $request, Group $group)
    {
        $data = $request->all();
        $user_ids = $data['user_ids'] ?? [] ;
        $group->update($data);

        // remove all the users and attache the new ones 
        $group->users()->detach();
        $group->users()->attach(array_unique([$request->user()->id, ...$user_ids]));
        return redirect()->back();

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy( $id)
    {
        $group = Group::where('id', $id)->first();
        // check user is owner of the group
        if($group->owner_id !== auth()->id()) {
            abort(403);
        }
        DeleteGroupJob::dispatch($group)->delay(now()->addSeconds(15));
        return response()->json(['message' =>'Group delete was scheduled and will be deleted soon']);
    }
}
