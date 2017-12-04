const initialState={
    messenger_id: null   
}

const setMessengerId=(state=initialState, action)=>{
    switch(action.type){
        case 'set_messenger_id':
            return {
                messenger_id: action.payload
            }

        default:
            return state;
    }
}

export default setMessengerId;