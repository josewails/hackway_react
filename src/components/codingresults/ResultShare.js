/*global MessengerExtensions */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import actions from '../../actions';
import {Preloader} from 'react-materialize'

import FacebookLogin from '../home/FacebookLogin.js';
import '../home/MainLogin.css';
import './RetrievedResult.css';

var request_promise=require('request-promise');

class RShare extends Component{

    constructor(props){
        super(props);
        this.handleResultShare=this.handleResultShare.bind(this);   
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
        const fb_id=this.props.facebook_id;
        const q_id=parseInt(this.props.question_id);
        const options={
            method: 'POST',
            uri: 'https://hackway.herokuapp.com/retrieve_results',
            form: {
                facebook_id: fb_id,
                question_id: q_id
            }
        }

        request_promise(options).then(function(body){
            that.props.setCurrentResult(JSON.parse(body));
        }).catch(function(err){
            console.log(err);
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

    handleResultShare(){
        const title=this.props.current_result.question_title;
        const url=window.location.origin+'/result/'+this.props.facebook_id+'/'+this.props.question_id;
        const subtitle=this.props.user_information.name+' sent you his results for this challenge';
        const image_url=this.props.user_information.profile_picture_url;
        
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
                        "title": "See Results",
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

    render(){
        const retrieved_res=this.props.current_result

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
            this.handleResultShare();
        }

        if(!this.props.connected){
            return (
                <div className="row center">
                    <div id='fb-button-holder' className="col s8 offset-s2">
                        <p>You have to login with facebook first</p>
                        <FacebookLogin />
                    </div>
                </div>
            )
        }

        else{
            return (<div>
                <Preloader size="small"/>
            </div>)
        }
    
    } 
}


const mapStatetoProps=(state)=>{
    return{
        current_result: state.setCurrentResult.current_result,
        connected : state.facebookLogin.connected,
        user_information: state.setUserInformation.user_information,
        messenger_id: state.setMessengerId.messenger_id,
        messenger_extensions: state.setMessengerExtensions.messenger_extensions
    }
}

const mapDispatchtoProps=(dispatch)=>{
    return (
        bindActionCreators(actions, dispatch)
    )
}

const ResultShare=connect(mapStatetoProps, mapDispatchtoProps)(RShare)

export default ResultShare;