const initial_state={
    coding_ground_results: null
}

const setCodingGroundResults = (state=initial_state, action) =>{
    switch(action.type){
        case 'set_coding_ground_results':
            return {
                coding_ground_results: action.payload
            }
        default:
            return state
    }
}

export default setCodingGroundResults;