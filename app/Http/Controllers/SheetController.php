<?php

namespace App\Http\Controllers;

use App\Http\Requests\SheetStoreRequest;
use App\Http\Requests\SheetUpdateRequest;
use App\Http\Resources\SheetResource;
use App\Models\Sheet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class SheetController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = $request->user();

        return SheetResource::collection(
            Sheet::where('user_id', $user->id)
                ->orderBy('id', 'asc')
                ->paginate(10)
        );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(SheetStoreRequest $request)
    {
        $data = $request->validated();

        // Check if image was given and save on a local file system
        if (isset($data['image'])) {
            $relativePath = $this->saveImage($data['image']);
            $data['image'] = $relativePath;
        }

        $sheet = Sheet::create($data);

        return new SheetResource($sheet);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Sheet $sheet, Request $request)
    {
        return new SheetResource($sheet);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(SheetUpdateRequest $request, Sheet $sheet)
    {
        $data = $request->validated();

        // Check if image was given and save on local file system
        if (isset($data['image'])) {
            $relativePath = $this->saveImage($data['image']);
            $data['image'] = $relativePath;

            // If there is an old image, delete it
            if ($sheet->image) {
                $absolutePath = public_path($sheet->image);
                File::delete($absolutePath);
            }
        }

        // Update survey in the database
        $sheet->update($data);

        return new SheetResource($sheet);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Sheet $sheet, Request $request)
    {
        $user = $request->user();
        if ($user->id !== $sheet->user_id) {
            return abort(403, 'Unauthorized action.');
        }

        $sheet->delete();

        // If there's an old image, delete it.
        if ($sheet->image) {
            $absolutePath = public_path($sheet->image);
            File::delete($absolutePath);
        }

        return response('', 204);
    }

    /** 
     * Save image in local file system and return saved image path
     * @param $image
     * @throws \Exception
     */

    private function saveImage($image)
    {
        // Check if image is valid base64 string
        if (preg_match('/^data:image\/(\w+);base64,/', $image, $type) || preg_match('/^data:application\/(\w+);base64,/', $image, $type)) {
            // Take out the base64 encoded text without mime type
            $image = substr($image, strpos($image, ',') + 1);
            // Get file extension
            $type = strtolower($type[1]); // jpg, png, gif

            // Check if file is an image
            if (!in_array($type, ['jpg', 'jpeg', 'gif', 'png', 'pdf'])) {
                throw new \Exception('invalid image type');
            }
            $image = str_replace(' ', '+', $image);
            $image = base64_decode($image);

            if ($image === false) {
                throw new \Exception('base64_decode failed');
            }
        } else {
            throw new \Exception('did not match data URI with image data');
        }

        $dir = 'images/';
        $file = Str::random() . '.' . $type;
        $absolutePath = public_path($dir);
        $relativePath = $dir . $file;
        if (!File::exists($absolutePath)) {
            File::makeDirectory($absolutePath, 0755, true);
        }
        file_put_contents($relativePath, $image);

        return $relativePath;
    }
}
