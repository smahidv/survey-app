<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSurveyAnswerRequest;
use App\Http\Requests\SurveyStoreRequest;
use App\Http\Requests\SurveyUpdateRequest;
use App\Http\Resources\SurveyResource;
use App\Models\Survey;
use App\Models\SurveyAnswer;
use App\Models\SurveyQuestion;
use App\Models\SurveyQuestionAnswer;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Arr;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Enum;
use App\Enums\QuestionTypeEnum;
use Illuminate\Support\Str;

class SurveyController extends Controller
{
    /**
     * Display a listing of the resource.
     */



    // this method is meant to fetch and return surveys associated with 
    //the authenticated user, ordered by creation date in descending order, 
    //and paginated with 3 surveys per page.
    public function index(Request $request)
    {
        $user = $request->user();  //returns an instance of the authenticated user if not 401 response is returned
        return SurveyResource::collection(
            Survey::where("user_id", $user->id)
                ->orderBy("created_at", "desc")
                ->paginate(2)

                //on the response we have the data / links of pages / meta that contain the data on the next pages 
                //SurveyResource is a costomize response
        );
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(SurveyStoreRequest $request)
    {
        $data = $request->validated();
        // print_r($data);

        //check if image was given and save on local file system
        if (isset($data['image'])) {

        
            // $relativePath = $this->saveImage($data['image']);
            // $data['image'] = $relativePath;
            $data['image'] = $this->saveImage($data['image']);

        }

        $survey = Survey::create($data);

        foreach ($data['questions'] as $question) {

// This associates the question with a survey by storing the survey's id in the question
            $question['survey_id'] = $survey->id;
            //$survey->id refers to the id of the newly created Survey instance
            // Each question is associated with the survey by setting the survey_id

            $this->createQuestion($question);
        }   
        return new SurveyResource($survey);
    }

    /**
     * Display the specified resource.
     */
    public function show(Survey $survey, Request $request)
    {
        $user = $request->user();
        if ($user->id !== $survey->user_id) {
            return abort(403, 'Unauthorized action');
        }
        return new SurveyResource($survey);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(SurveyUpdateRequest $request, Survey $survey)
    {
        $data = $request->validated();

        // Check if image was given and save on local file system
        if (isset($data['image'])) {
            $data['image'] = $this->saveImage($data['image']);

            // If there is an old image, delete it
            if ($survey->image) {
                $absolutePath = public_path($survey->image);
                File::delete($absolutePath);
            }
        }

        // Update survey in the database
        $survey->update($data);


 
        //The existing question IDs associated with the survey are retrieved using pluck. 
        // The new question IDs from the updated data are extracted using Arr::pluck.
        // 'id' : name of column (primary key of questionSurvey)
        $existingIds = $survey->questions()->pluck('id')->toArray();
        $newIds = Arr::pluck($data['questions'], 'id');




        // Find questions to delete
        // 'id' values that are in $existingIds but not in $newId
        $toDelete = array_diff($existingIds, $newIds);



        //Find questions to add
        $toAdd = array_diff($newIds, $existingIds);
        //  'id' values that are in $newIds but not in $existingIds


        // Delete questions by $toDelete array
        SurveyQuestion::destroy($toDelete);

        // Create new questions
        foreach ($data['questions'] as $question) {

            // Create new questions
            if (in_array($question['id'], $toAdd)) {

                $question['survey_id'] = $survey->id;
                
                $this->createQuestion($question);
            }
        }

        // Update existing questions
        $questionMap = collect($data['questions'])->keyBy('id');
        foreach ($survey->questions as $question) {
            if (isset($questionMap[$question->id])) {
                $this->updateQuestion($question, $questionMap[$question->id]);
            }
        }


        return new SurveyResource($survey);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Survey $survey, Request $request)
    {
        $user = $request->user();
        if ($user->id !== $survey->user_id) {
            return abort(403, 'Unauthorized action.');
        }

        $survey->delete();

        // If there is an old image, delete it
        if ($survey->image) {
            $absolutePath = public_path($survey->image);
            File::delete($absolutePath);
        }

        return response('', 204);
    }



    private function saveImage(string $image)
    {
        // Check if image is valid base64 string
        if (preg_match('/^data:image\/(\w+);base64,/', $image, $type)) {
            // $type currently holds the matched image type (e.g., "jpeg")

            // Take out the base64 encoded text without mime type
            //Removes the "data:image/{type};base64," prefix
            $image = substr($image, strpos($image, ',') + 1);
            // The + 1 ensures that the comma itself is not included in the substring

            // Get file extension (e.g., "jpeg")
            $type = strtolower($type[1]);//$type[0] = $image


            // Check if file is an image 
            if (!in_array($type, ['jpg', 'jpeg', 'gif', 'png'])) {
                throw new \Exception('Invalid image type');
            }

            // Replace any whitespace characters in the base64 data
            $image = str_replace(' ', '+', $image);

            // Decode the base64 data into binary image data
            $image = base64_decode($image);

            // Check if base64 decoding was not successful
            if ($image === false) {
                throw new \Exception('base64_decode failed');
            }

            // Directory settings
            $dir = 'images/';
            $file = Str::random() . '.' . $type;
            $absolutePath = public_path($dir);
            $relativePath = $dir . $file;

            // Check if the directory exists; if not, create it
            if (!File::exists($absolutePath)) {
                File::makeDirectory($absolutePath, 0755, true);
            }

            // Save the image file
            file_put_contents($relativePath, $image);

            // $relativePath now holds the relative path to the saved image

            return $relativePath;
        }
    }

    private function createQuestion($data)
    {
        if (is_array($data['data'])) {
            $data['data'] = json_encode($data['data']);
        }
        $validator = Validator::make($data, [
            'question' => 'required|string',
            'type' => [
                'required', new Enum(QuestionTypeEnum::class),
            ],
            'description' => 'nullable|string',
            //present ensures that the field is not null and not an empty string
            'data' => 'present',
            'survey_id' => 'exists:App\Models\Survey,id'
        ]);

        return SurveyQuestion::create($validator->validated());
    }

    private function updateQuestion(SurveyQuestion $question, $data)
    {
        if (is_array($data['data'])) {
            $data['data'] = json_encode($data['data']);
        }
        $validator = Validator::make($data, [
            'id' => 'exists:App\Models\SurveyQuestion,id',
            'question' => 'required|string',
            'type' => ['required', new Enum(QuestionTypeEnum::class)],
            'description' => 'nullable|string',
            'data' => 'present',
        ]);

        return $question->update($validator->validated());
    }
public function getBySlug(Survey $survey)
{
//    return $survey;
// return new SurveyResource($survey);


if (!$survey->status) {
    return response("the surveys is not active", 404);
}

$currentDate = new \DateTime();
$expireDate = new \DateTime($survey->expire_date);
if ($currentDate > $expireDate) {
    return response("", 404);
}

return new SurveyResource($survey);
}


public function storeAnswer(StoreSurveyAnswerRequest $request, Survey $survey)

{
    $validated = $request->validated();

    $surveyAnswer = SurveyAnswer::create([
        'survey_id' => $survey->id,
        'start_date' => date('Y-m-d H:i:s'),
        'end_date' => date('Y-m-d H:i:s'),
        // you can set the average time of the user answering the survey
    ]);

    foreach ($validated['answers'] as $questionId => $answer) {
        $question = SurveyQuestion::where(['id' => $questionId, 'survey_id' => $survey->id])->get();
        if (!$question) {
            return response("Invalid question ID: \"$questionId\"", 400);
        }

        $data = [
            'survey_question_id' => $questionId,
            'survey_answer_id' => $surveyAnswer->id,
            'answer' => is_array($answer) ? json_encode($answer) : $answer
        ];

        $questionAnswer = SurveyQuestionAnswer::create($data);
    }

    return response("", 201);
}
}

