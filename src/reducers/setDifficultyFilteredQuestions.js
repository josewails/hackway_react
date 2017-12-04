const initialState={
    'difficulty_filtered_questions': null
}

const setDifficultyFilteredQuestions=(state=initialState, action)=>{
    switch(action.type){
        case 'set_difficulty_filtered_questions':
            return {
                'difficulty_filtered_questions': action.payload
            }

        default:
            return state
    }
}

export default setDifficultyFilteredQuestions