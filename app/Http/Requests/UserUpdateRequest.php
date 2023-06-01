<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class UserUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
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
            'name' => 'required|string',
            'email' => 'required|email|string|unique:users,email,'.$this->id,
            'user_role_id' => 'required|exists:user_roles,id',
            'teacher_id' => 'nullable',
            'password' => [
                'confirmed',
                Password::min(8)
                ->mixedCase()
                ->numbers()
                ->symbols()
            ],   
        ];
    }
}
