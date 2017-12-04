/*global MessengerExtensions */
import React, {Component} from 'react';
import {Col,CardPanel, Modal, Button, Collection, CollectionItem, Chip} from 'react-materialize';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import actions from '../../actions';

import FacebookLogin from '../home/FacebookLogin.js';
import '../home/MainLogin.css';
import './RetrievedResult.css';

var request_promise=require('request-promise');

class RResult extends Component{

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

    handleResultShare(e){
        e.preventDefault();
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
                alert('nothing is happening');
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
        if(retrieved_res===null){
            return (
                <div>
                    <div>Nothing here</div>
                </div>
            )
        }
        else{
            console.log(retrieved_res);
            if(retrieved_res.success===false)
                {
                    const source_code=retrieved_res.source_code;

                    const test_cases_passed=retrieved_res.testcases_passed.map((test_case)=>{
                        return (
                            <CollectionItem key={test_case}>{test_case} <i className='material-icons green left'>check</i></CollectionItem>
                        )
                    });

                    const test_cases_failed=retrieved_res.testcases_failed.map((test_case)=>{
                        return (
                            <CollectionItem key={test_case}>{test_case} <i className='material-icons red left'>close</i></CollectionItem>
                        )
                    });


                    return(
                        <div>
                                <Col s={12} m={7}>
                                        <h5>Question </h5>
                                        <CardPanel className="white lighten-4 black-text">
                                            <p>{retrieved_res.question}</p>
                                        </CardPanel>
                                        
                                </Col>
                                <Col s={12} m={5}>
                                        <h5>Results</h5>
                                        <CardPanel className="red lighten-4 black-text">
                                            <p>status: Failure</p>
                                            <text>Failed TestCase: {retrieved_res.testcases_failed[0]}</text>
                                            <p>Error : {retrieved_res.error}</p>
                                            
                                            <span id='testcases-modal'>
                                                <Modal
                                                    header='Test Cases'
                                                    trigger={<Button className='red'>Test Cases</Button>}>

                                                    <Collection>
                                                        {test_cases_passed}
                                                        {test_cases_failed}
                                                    </Collection>
                                                    
                                                </Modal> 
                                            </span>
                                            <span id='code-modal'>
                                                <Modal
                                                    header='Your Code'
                                                    trigger={<Button className='red'>Submitted Code</Button>}>
                                                    <p>
                                                        {source_code}
                                                    </p>
                                                </Modal> 
                                            </span>

                                            <span>You can <a href="#"  onClick={this.handleResultShare.bind(this)}><Chip>Share</Chip></a> this code on messenger</span>
                                        </CardPanel>
                                </Col>
                            <hr />
                        </div>
                    )
        
                }
                else if(retrieved_res.success === true){

                    const source_code=retrieved_res.source_code;

                    const test_cases_passed=retrieved_res.test_cases_passed.map((test_case)=>{
                        return (
                            <CollectionItem key={test_case}>{test_case} <i className='material-icons green left'>check</i></CollectionItem>
                        )
                    });
                    return(
                        <div>
                                <Col s={12} m={7}>
                                    <h5>Question </h5>
                                    <CardPanel className="white lighten-4 black-text">
                                        <p>{retrieved_res.question}</p>
                                    </CardPanel>
                                </Col>
                                <Col s={12} m={5}>
                                        <h5>Results</h5>
                                        <CardPanel className="green lighten-4 black-text">
                                            <p>Status: Success</p>
                                            <span id='testcases-modal'>
                                                <Modal
                                                    header='Test Cases'
                                                    trigger={<Button className='green'>Test Cases</Button>}>

                                                    <Collection>
                                                        {test_cases_passed}
                                                    </Collection>
                                                    
                                                </Modal> 
                                            </span>
                                            <span id='code-modal'>
                                                <Modal
                                                    header='Submitted Code'
                                                    trigger={<Button className='red'>Submitted Code</Button>}>
                                                    <p>
                                                        {source_code}
                                                    </p>
                                                </Modal> 
                                            </span>
                                            <span>You can <a href="#" onClick={this.handleResultShare.bind(this)}><Chip>Share</Chip></a> these results on messenger</span>
                                        </CardPanel>  
                                </Col>
                            <hr />
                        </div>
                    )
                }
                else{
                    return (
                        <div>
                            <p>Error : {retrieved_res.error}</p>
                        </div>
                    )
                }

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

const RetrievedResult=connect(mapStatetoProps, mapDispatchtoProps)(RResult)

export default RetrievedResult;