<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SheetUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $sheet = $this->route('sheet');
        if ($this->user()->id !== $sheet->user_id){
            return false;
        }
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'title' => 'required|string|max:1000',
            'image' => 'nullable|string',
            'user_id' => 'exists:users,id',
            'description' => 'nullable|string',
            'notemap' => 'string'
        ];
    }
}
