const initialState={
    'all_ranking': null
}

const setAllRanking=(state=initialState, action)=>{
    switch(action.type){
        case 'set_all_ranking':
            return {
                'all_ranking': action.payload
            }
        default:
            return state
    }
}

export default setAllRanking;