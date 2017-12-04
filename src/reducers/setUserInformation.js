const setUserInformation=(state={user_information: null}, action)=>{
    switch(action.type){
        case 'set_user_information':
            console.log(action.payload);
            return {
                user_information: action.payload
            }
        default:
            return state
    }
}

export default setUserInformation;