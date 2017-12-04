
/*global FB*/
import React ,{Component} from 'react';
import actions from '../../actions';
import {bindActionCreators} from 'redux';
import  {connect} from 'react-redux';
const request=require('request')
var request_promise=require('request-promise');

class FaceBookLogin extends Component {
        constructor(props) {
        super(props);
        this.createFaceBookUser=this.createFaceBookUser.bind(this);     
        }
    
        loadFbLoginApi() {
    
            window.fbAsyncInit = function() {
                FB.init({
                    appId      : '138163653574762',
                    cookie     : true,  // enable cookies to allow the server to access
                    // the session
                    autoLogAppEvents : true,
                    xfbml      : true,  // parse social plugins on this page
                    version    : 'v2.10' // use version 2.1
                });
            };
    

            (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = "//connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        }
  
        componentDidMount() {
            this.loadFbLoginApi();
            console.log(window.FB);
        }

        statusChangeCallback(response) {
            console.log('statusChangeCallback');
            console.log(response);
            if (response.status === 'connected') {
                console.log("connected");
            } 
            else{
                console.log(response.status);
            }
        }

        checkLoginState() {
            FB.getLoginStatus(function(response) {
            this.statusChangeCallback(response);
          }.bind(this));
        }

        handleFBLogin(response){
            const that=this;
             FB.login(function(response) {
                if (response.authResponse) {
                 console.log('Welcome!  Fetching your information.... ');
                 FB.api('me?fields=id,name,birthday,picture{url},age_range,friends{name,id}', function(response) {
                   localStorage.setItem('facebook_id', response.id);
                   that.props.setFacebookId(response.id);

                   localStorage.setItem('connected', 'true');
                   that.props.setConnected(true);
                   console.log(response);
                   that.createFaceBookUser(response);

                 });
                } else {
                 console.log('User cancelled login or did not fully authorize.');
                 localStorage.setItem('connected', 'false');
                 localStorage.setItem('facebook_id', 'null')

                 that.props.setFacebookId(null);
                 that.props.setConnected(false);
                }
            });
        }

        handleFbLogout(){
            console.log("logging out");
            localStorage.setItem('connected', false);
            localStorage.setItem('facebook_id', 'null')

            this.props.setConnected(false);
            
            FB.logout(function(response){
                console.log('Logout will be handled here');
            });
        }

        createFaceBookUser(response){
            const options={
                method: 'POST',
                uri: 'https://hackway.herokuapp.com/facebook_users/create',
                form: {
                    name: response.name,
                    email: response.email,
                    facebook_id: response.id,
                    profile_picture_url: response.picture.data.url
                }
            }

            request_promise(options).then(function(body){
                console.log(body);
            }).catch(function(err){
                console.log(err)
            })
        }

        getButton(){
            const connected_props=this.props.connected;

            if(connected_props === true){
                return (
                    <button onClick={this.handleFbLogout.bind(this)} className="btn waves-effect waves-light">FB Logout
                        <i className="material-icons right">send</i>
                    </button>   
                )
            }else{
                return (
                    <button onClick={this.handleFBLogin.bind(this)} className="btn waves-effect waves-light">FB Login
                        <i className="material-icons right">send</i>
                    </button>                    
                )

            }
        }

        render() {
            const button=this.getButton()

            return (
            <div>
                {button}
            </div>
        );
    }
  }

  function mapStatetoProps(state){
      return {
          connected: state.facebookLogin.connected,
          facebook_id: state.setFacebookId.facebook_id
      }
  }

  function mapDispatchtoProps(dispatch){
      return(
          bindActionCreators(actions, dispatch)
      );
  }

  const FbLogin=connect(mapStatetoProps, mapDispatchtoProps)(FaceBookLogin)
  
  export default FbLogin;