import {createStore} from 'redux'
import rootReducer from './reducers'

const connected=(localStorage.getItem("connected") === "true") ? true : false;

const defaultState={
    facebookLogin: {
        connected : connected
    },
    setFacebookId:{
        facebook_id: localStorage.getItem('facebook_id')
    },
    setWaitingCodeSubmission:{
        waiting_code_res: false
    }
}

const store=createStore(rootReducer, defaultState)

export default store;