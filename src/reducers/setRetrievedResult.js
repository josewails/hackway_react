const initialState={
    retrieved_result: null   
}

const setRetrievedResult=(state=initialState, action)=>{
    switch(action.type){
        case 'set_retrieved_result':
            return {
                retrieved_result: action.payload
            }

        default:
            return state;
    }
}

export default setRetrievedResult;