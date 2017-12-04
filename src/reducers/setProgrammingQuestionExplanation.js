const initial_state={
    'programming_question_explanation': null
}


const setProgrammingQuestionExplanation= (state=initial_state, action)=>{
    switch(action.type){
        case 'set_programming_question_explanation':
            return {
                'programming_question_explanation': action.payload
            }

        default:
            return state
    }
}

export default setProgrammingQuestionExplanation;