/*global MessengerExtensions */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import FacebookLogin from '../home/FacebookLogin';
import {Preloader} from 'react-materialize'

import actions from '../../actions';


import '../home/MainLogin.css';
import './CurrentQuestion.css';

var request=require('request');
var request_promise=require('request-promise');


class QShare extends Component{
    constructor(props){
        super(props);
        this.handleQuestionShare=this.handleQuestionShare.bind(this);
    }

    handleQuestionShare(){
        const title=this.props.current_question.title;
        const url=window.location.origin+'/all_coding_questions/'+this.props.question_id;
        const subtitle=this.props.user_information.name+' sent you a challenge';
        const image_url=this.props.user_information.profile_picture_url

        var messageToShare = {
            "attachment":{
               "type":"template",
               "payload":{
                   "template_type":"generic",
                   "elements": [{
                       "title":title,
                       "subtitle":subtitle,
                       "image_url": image_url,
                       "default_action":{
                           "type":"web_url",
                           "url": url,
                           "webview_height_ratio": "full",
                           'messenger_extensions': true
                       },
                       "buttons":[{
                        "type": "web_url",
                        "url": url,
                        "title": "Solve it",
                        "webview_height_ratio": "full",
                        'messenger_extensions': true
                    }]
                   }]
               }
            }
          };
        
        MessengerExtensions.beginShareFlow(function success(response) {
            if(response.is_sent === true){ 
                // User shared. We're done here!
                //we can send a message to the user telling them that their message was shared successfully
                MessengerExtensions.requestCloseBrowser();
            }
            else{
                // User canceled their share! 
                //We can send a message informing them that their share was not successful
                console.log('nothing is happening');
            }
        }, 
        function error(errorCode, errorMessage) {      
            // An error occurred trying to share!
            alert(errorMessage);
        },
        messageToShare,
        "broadcast");   

    }

    componentDidMount(){
        const that=this;
        window.extAsyncInit = function() {
            MessengerExtensions.getContext('138163653574762', 
                function success(thread_context){
                    that.props.setMessengerId(thread_context.psid);
                    that.props.setMessengerExtensions(true);
                },
                function error(err){
                    console.log(err);
                    that.props.setMessengerExtensions(false);
                }
            );
        };
    }

    componentWillMount(){
      
        (function(d, s, id){
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) {return;}
          js = d.createElement(s); js.id = id;
          js.src = "//connect.facebook.com/en_US/messenger.Extensions.js";
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'Messenger'));

        const that=this;

        const options1={
            url : 'https://hackway.herokuapp.com/coding_questions/'+ this.props.question_id
        }

        request.get(options1, function(error, response, body){
            body=JSON.parse(body);
            that.props.setCurrentQuestion(body);
        })


        const facebook_id=localStorage.getItem('facebook_id');
        const options2={
            uri: 'https://hackway.herokuapp.com/facebook_users/'+facebook_id,
            method: 'GET'
        }
        request_promise(options2).then(function(body){
            that.props.setUserInformation(JSON.parse(body));
        }).catch(function(error){
            alert(error);
        });

    }

    render(){

        var connected=this.props.connected;

        console.log(connected);

        if(this.props.messenger_extensions === false){
            return (
                <div>
                    <div className="row">
                        <div className='col offset-s1'>
                            This page requires Messenger Extensions which are not supported in this browser. Click
                            the button below to Access our Bot for All Features.
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col offset-s3'>
                            <a className="btn green" href="https://www.messenger.com/t/2073931602829622">HackWay</a>
                        </div>
                    </div>
                </div>
            )
        }

        if(this.props.messenger_id){
            this.handleQuestionShare();
        }

        if(connected !== true){
            return (
                <div className="row center">
                    <div id='fb-button-holder' className="col s8 offset-s2">
                        <p>You have to login with facebook first</p>
                        <FacebookLogin />
                    </div>
                </div>
            )
        }

        return (
            <div>
                <Preloader  size='small'/>
            </div>
        )
    }
       
}

const mapStatetoProps=(state)=>{
    return{
        current_question: state.setCurrentQuestion.current_question,
        messenger_id: state.setMessengerId.messenger_id,
        connected: state.facebookLogin.connected,
        user_information: state.setUserInformation.user_information,
        messenger_extensions: state.setMessengerExtensions.messenger_extensions
    }
}

const mapDispatchtoProps=(dispatch)=>{
    return (
        bindActionCreators(actions, dispatch)
    )
}

const QuestionShare=connect(mapStatetoProps, mapDispatchtoProps)(QShare)

export default QuestionShare;