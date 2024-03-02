<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SurveyStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
    //before executing the rules
    protected function prepareForValidation()
    {
        $this->merge([
            'user_id' => $this->user()->id,
            //associating the 'user_id' with the authenticated user
            //user()->id is the current user
        ]);
    }


    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:1000',
            'image' => 'nullable|string',
            'user_id' => 'exists:users,id',
            'status' => 'required|boolean',
            'description' => 'nullable|string',
            'expire_date' => 'nullable|date|after:today',
            'questions' => 'array',
        ];
    }
}
