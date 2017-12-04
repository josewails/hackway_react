const initialState={
    facebook_id : null
}
const setFacebookId=(state=initialState, action)=>{
    switch(action.type){
        case 'set_facebook_id':
           return {
               facebook_id: action.payload
           }
        default:
           return state;
    }
}

export default setFacebookId;