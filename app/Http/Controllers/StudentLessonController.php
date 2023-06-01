<?php

namespace App\Http\Controllers;

use App\Http\Requests\StudentLessonUpdateRequest;
use App\Http\Resources\StudentLessonResource;
use App\Models\StudentLesson;
use Illuminate\Http\Request;

class StudentLessonController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = StudentLessonResource::collection(
            StudentLesson::select('status', 'score', 'current_progress', 'last_accessed_at', 'title', 'description', 'sheets.id')
                ->join('sheets', 'sheets.id', '=', 'lesson_id')
                ->where('student_lessons.user_id', '=', $user->id)
                ->where('status', '!=', 2)
                ->orderBy('student_lessons.id')
                ->paginate(10)
        );

        return $query;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $query =
            StudentLesson::select('status', 'score', 'current_progress', 'start_date', 'last_accessed_at', 'title', 'description', 'sheets.id')
            ->join('sheets', 'sheets.id', '=', 'lesson_id')
            ->where('student_lessons.user_id', '=', $id)
            ->where('status', '!=', 2)
            ->orderBy('student_lessons.id')
            ->get();
        return $query;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function showCurrentLesson($id, Request $request)
    {
        $user = $request->user();
        $query =
            StudentLesson::select('status', 'score', 'current_progress', 'start_date', 'last_accessed_at', 'lesson_id', 'user_id')
            ->where('student_lessons.user_id', '=', $user->id)
            ->where('student_lessons.lesson_id', '=', $id)
            ->orderBy('student_lessons.id')
            ->get();
        return $query;
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(StudentLessonUpdateRequest $request, $id)
    {
        foreach ($request->sheets as $element) {
            $query = StudentLesson::where('student_lessons.user_id', '=', $id)
                ->where('student_lessons.lesson_id', '=', $element['id'])
                ->update([
                    'status' => $element['status'],
                    'score' => $element['score'],
                    'current_progress' => $element['current_progress'],
                    'last_accessed_at' => $element['last_accessed_at'],
                    'start_date' => $element['start_date']

                ]);
        }
        return 'success';
    }

    public function updateLessonPlay(StudentLessonUpdateRequest $request, $id, StudentLesson $student)
    {
        foreach ($request->studentLesson as $element) {
            
            $query = StudentLesson::where('student_lessons.user_id', '=', $element['user_id'])
                ->where('student_lessons.lesson_id', '=', $element['lesson_id'])
                ->update([
                    'status' => $element['status'],
                    'score' => $element['score'],
                    'current_progress' => $element['current_progress'],
                    'last_accessed_at' => $element['last_accessed_at'],
                    'start_date' => $element['start_date']
                ]);
        }
        return 'Success';
    }
}
