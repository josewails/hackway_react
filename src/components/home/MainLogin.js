import React, {Component} from 'react'
import FacebookLogin from './FacebookLogin'
import './MainLogin.css'

class MainLogin extends Component{
    render(){
        return (
            <div>
                <div className="row center">
                    <div id='fb-button-holder' className="col s8 offset-s2">
                        <p>Login with Facebook</p>
                        <FacebookLogin />
                    </div>
                </div>
            </div>
        )
    }
}
export default MainLogin;