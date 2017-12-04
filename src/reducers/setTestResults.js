const initialState={
    test_results : null
}

const setTestResults =(state=initialState, action)=>{
    switch(action.type){
        case 'set_test_results':
            return {
                'test_results': action.payload
            }

        default:
            return state
    }
}

export default setTestResults;