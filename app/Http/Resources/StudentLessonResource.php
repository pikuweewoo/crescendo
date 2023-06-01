<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class StudentLessonResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'status' => !!$this->status,
            'score' => $this->score,
            'current_progress' => $this->current_progress,
            'start_date' => $this->start_date ? $this->start_date : '',
            'last_accessed_at' => $this->last_accessed_at ? $this->last_accessed_at : '',
            'title' => $this->title,
            'description' => $this->description,
        ];
    }
}
