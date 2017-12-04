const facebookLogin=(state={connected : null}, action)=>{
    switch(action.type){
        case 'set_connected':
           if(action.payload === true){
               return {
                   connected : true
               }
           }
           else{
               return {
                   connected: false
               }
           }
        default:
           return state
    }
}

export default facebookLogin;