const initialState={
    'individual_ranking': null
}

const setIndividualRanking=(state=initialState, action)=>{
    switch(action.type){
        case 'set_individual_ranking':
            return {
                'individual_ranking': action.payload
            }
        default:
            return state
    }
}

export default setIndividualRanking;