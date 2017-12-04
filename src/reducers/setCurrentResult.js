const initialState={
    current_result: null
}

const setCurrentResult=(state=initialState, action)=>{
    switch(action.type){
        case 'set_current_result':
            return{
                'current_result': action.payload
            }
        default:
            return state
    }
}

export default setCurrentResult;