export const setConnected= (status)=>{
    return {
        type: 'set_connected',
        payload: status
    }
}

export const setFacebookId=(facebook_id)=>{
    return{
        type: 'set_facebook_id',
        payload : facebook_id
    }
}

export const setUserInformation= (data) => {
    return {
        type: 'set_user_information',
        payload: data
    }
}

export const setAllQuestions = (data) =>{
    return {
        type: 'set_all_questions',
        payload: data
    }
}

export const setCurrentQuestion=(data) =>{
    return {
        type: 'set_current_question',
        payload: data
    }
}

export const setEditorOptions = (data)=>{
    return {
        type: 'set_editor_options',
        payload: data
    }
}



export const setSourceCode =(source_code) =>{
    return {
        type: 'set_source_code',
        payload: source_code
    }
}

export const setAllCoderResults=(result)=>{
    return {
        type: 'set_all_coder_results',
        payload: result
    }
}

export const setRetrievedResult= (res) =>{
    return {
        type: 'set_retrieved_result',
        payload: res
    }
}

export const setDifficultyFilteredQuestions=(data) =>{
    return {
        type: 'set_difficulty_filtered_questions',
        payload: data
    }
}

export const setWaitingCodeSubmission=(waiting_status)=>{
    return {
        type: 'set_waiting_code_submission',
        payload : waiting_status
    }
}

export const setCurrentResult= (result)=>{
    return {
        type: 'set_current_result',
        payload: result
    }
}

export const setMessengerId =(data)=>{
    return {
        type: 'set_messenger_id',
        payload : data
    }
}

export const setIndividualRanking=(data) =>{
    return {
        type: 'set_individual_ranking',
        payload : data
    }
}

export const setAllRanking=(data) =>{
    return {
        type: 'set_all_ranking',
        payload : data
    }
}

export const setMessengerExtensions=(status)=>{
    return {
        type: 'set_messenger_extensions',
        payload: status
    }
}

export const setProgrammingQuestionExplanation=(data)=>{
    return {
        type: 'set_programming_question_explanation',
        payload : data
    }
}

export const setCodingGroundResults = (data) => {
    return {
        type: 'set_coding_ground_results',
        payload : data
    }
}

export const setTestResults = (data) =>{
    return {
        type: 'set_test_results',
        payload : data
    }
}

export const setAllCourses= (data) =>{
    return {
        type: 'set_all_courses',
        payload : data
    }
}

export const setCourseData =(data) =>{
    return {
        type: 'set_course_data',
        payload : data
    }
}

export const setCourseSegmentData = (data) =>{
    return {
        type: 'set_course_segment_data',
        payload : data
    }
}