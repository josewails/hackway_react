const initialState={
    source_code: ''
}

const setSourceCode = (state=initialState, action)=>{
    switch(action.type){
        case 'set_source_code':
            return {
                source_code : action.payload
            }

        default:
            return state;
    }
}

export default setSourceCode;