const initialState={
    all_coder_results: null
}

const setAllCoderResults =(state=initialState, action) =>{
    switch(action.type){
        case 'set_all_coder_results':
            return {
                all_coder_results: action.payload
            }

        default:
            return state;
    }
}

export default setAllCoderResults;