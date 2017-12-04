const initialState={
    all_questions : null
}

const setAllQuestions =(state=initialState, action) =>{
    switch(action.type){
        case 'set_all_questions':
            return {
                all_questions: action.payload
            }

        default:
            return state;
    }
}

export default setAllQuestions;