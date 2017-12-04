const initialState={
    messenger_extensions: null
}

const setMessengerExtensions=(state=initialState, action)=>{
    switch(action.type){
        case 'set_messenger_extensions':
            return{
                messenger_extensions: action.payload
            }

        default:
            return state;
    }
}

export default setMessengerExtensions;