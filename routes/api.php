<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\SheetController;
use App\Http\Controllers\StudentLessonController;
use App\Http\Controllers\SurveyController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VideoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::apiResource('survey', SurveyController::class);
    Route::apiResource('sheet', SheetController::class);
    Route::apiResource('user', UserController::class);
    Route::apiResource('lesson', StudentLessonController::class);
    Route::apiResource('video', VideoController::class);

    Route::put('/lesson/play/{id}', [StudentLessonController::class, 'updateLessonPlay']);
    
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/students', [UserController::class, 'studentIndex']);
    Route::get('/lessons', [StudentLessonController::class, 'index']);
    Route::get('/currentLesson/{id}', [StudentLessonController::class, 'showCurrentLesson']);
    Route::get('/videos', [VideoController::class, 'index']);
    Route::get('/noteacherstudents', [UserController::class, 'noTeacherStudentIndex']);
    //Route::put('/omr', [OMRController::class, 'index']);
    //Route::get('/getApi')
});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/survey/get-by-slug/{survey:slug}', [SurveyController::class, 'getBySlug']);
Route::post('/survey/{survey}/answer', [SurveyController::class, 'storeAnswer']);
