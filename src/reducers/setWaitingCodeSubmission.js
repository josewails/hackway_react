const initialState={
    waiting_code_res: false
}
const setWaitingCodeSubmission=(state=initialState, action)=>{
    switch(action.type){
        case 'set_waiting_code_submission':
            return{
                waiting_code_res: action.payload
            }
        default:
            return state
    }
}

export default setWaitingCodeSubmission;