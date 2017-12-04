const initialState={
    current_question: null
}

const setCurrentQuestion=(state=initialState, action)=>{
    switch(action.type){
        case 'set_current_question':
            return{
                current_question: action.payload
            };

        default:
            return state;
    }
}
export default setCurrentQuestion;