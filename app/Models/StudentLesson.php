<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentLesson extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'lesson_id', 'status', 'score', 'current_progress', 
    'start_date', 'last_accessed_at', 'created_at', 'updated_at'];
}
