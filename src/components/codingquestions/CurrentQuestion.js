/*global MessengerExtensions */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Input, Preloader, Chip, Col, CardPanel} from 'react-materialize';
import FacebookLogin from '../home/FacebookLogin';

import actions from '../../actions';


import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/jsx';
import 'brace/ext/language_tools';
import 'brace/ext/searchbox';

import '../home/MainLogin.css';
import './CurrentQuestion.css';

var request=require('request');
var request_promise=require('request-promise');

const languages = [
  'java',
  'python',
  'javascript'
]

const themes = [
  'monokai',
  'github',
  'tomorrow',
  'kuroir',
  'twilight',
  'xcode',
  'textmate',
  'solarized_dark',
  'solarized_light',
  'terminal',
]

languages.forEach((lang) => {
  require(`brace/mode/${lang}`)
  require(`brace/snippets/${lang}`)
})

themes.forEach((theme) => {
  require(`brace/theme/${theme}`)
})
/*eslint-disable no-alert, no-console */


class CQuestion extends Component{
    constructor(props){
        super(props);
        this.onChange=this.onChange.bind(this);
        this.handleCodeSubmit=this.handleCodeSubmit.bind(this);
        this.handleQuestionShare=this.handleQuestionShare.bind(this);
        this.handleTestSubmit=this.handleTestSubmit.bind(this);
    }

    onChange(newValue){
       this.props.setSourceCode(newValue);
    }

    handleQuestionShare(){
        const title=this.props.current_question.title;
        const url=window.location.href;
        const subtitle=this.props.user_information.name+' sent you a challenge';
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
                           "webview_height_ratio": 'full',
                           "messenger_extensions": true
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

          MessengerExtensions.getSupportedFeatures(function success(result) {
            let features = result.supported_features;
            console.log(features);
          }, function error(err) {
            // error retrieving supported features
          });
        
     
        MessengerExtensions.beginShareFlow(function success(response) {
            if(response.is_sent === true){ 
                // User shared. We're done here!
                //we can send a message to the user telling them that their message was shared successfully

                MessengerExtensions.requestCloseBrowser();
            }
            else{
                // User canceled their share! 
                //We can send a message informing them that their share was not successful
                alert('Your message was not shared. Try again!!');
            }
        }, 
        function error(errorCode, errorMessage) {      
            // An error occurred trying to share!
            console.log(errorMessage);
        },
        messageToShare,
        "broadcast");   
   

    }

    handleTestSubmit(e){
        e.preventDefault();
        const that=this;
        
        if(this.props.source_code === ''){
            alert("You can not make an empty submission");
            return;
        }

        const current_question=that.props.current_question;
        that.props.setWaitingCodeSubmission(true);
        const options={
            uri: 'https://hackway.herokuapp.com/check_ground_code',
            method: 'POST',
            form : {
                source_code: this.props.source_code,
                language_used: this.props.editor_language,
                testcases:current_question.input
            }
        }

        request_promise(options).then(function(data){
            that.props.setTestResults(JSON.parse(data));
            that.props.setWaitingCodeSubmission(false);
        }).catch(function(error){
            console.log(error);
            that.props.setWaitingCodeSubmission(false);
        });
    }

    handleCodeSubmit(e){
        e.preventDefault();
        const that=this;

        if(this.props.source_code === ''){
            alert("You can not make an empty submission");
            return;
        }

        that.props.setWaitingCodeSubmission(true);

        const options={
            url: 'https://hackway.herokuapp.com/check_code',
            form : {
                facebook_id: localStorage.getItem('facebook_id'),
                question_id: this.props.question_id,
                source_code: this.props.source_code,
                language_used: this.props.editor_language
            }
        }

        console.log(options);

        request.post(options, function(error, response, body){
            body=JSON.parse(body);
            console.log(body);
            that.props.setWaitingCodeSubmission(false);
            
            const messenger_id=that.props.messenger_id;
            const facebook_id=localStorage.getItem('facebook_id');
            const question_id=that.props.current_question.id;

            if(messenger_id){
                const options={
                    method: 'POST',
                    uri: 'https://hackway.herokuapp.com/send_coding_results',
                    form: {
                        facebook_id: facebook_id,
                        question_id: question_id,
                        messenger_id: messenger_id
                    }
                }
        
                request_promise(options).then(function(body){
                    MessengerExtensions.requestCloseBrowser(function success() {
                        console.log('closed');
                      }, function error(err) {
                         console.log(err);
                      });
                }).catch(function(err){
                    alert(err);
                })
            }
        });
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
            console.log(error);
        });

    }

    render(){
        let editor_language=this.props.editor_language;
        let editor_theme=this.props.editor_theme;
        let test_results=this.props.test_results
        var connected=this.props.connected;
        let result_card=null;

        if(test_results){
            if(test_results){
                console.log(test_results);
                if(test_results.success === true){
                    result_card=<div>
                        <Col s={12} m={12} l={12}>
                                <CardPanel className="green lighten-4 black-text">
                                        <h5 className='red-text'>Sample Input Results</h5>
                                        <p>{test_results.result}</p>
                                </CardPanel>
                        </Col>
                    </div>
                }
                else{
                    result_card=<div>
                        <Col s={12} m={12} l={12}>
                                <CardPanel className="red lighten-4 black-text">
                                        <h5 className='red-text'>Sample Input Results</h5>
                                        <p>{test_results.message}</p>
                                        <h5>Error</h5>
                                        <p>{test_results.error}</p>
                                </CardPanel>
                        </Col>
                    </div>
                }
            }
        }

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

        let button_holder=null

        if(this.props.waiting_code_res){
            button_holder=<div>
                <Preloader size='small'/>
            </div>
        }else{
            button_holder=<div>
                <div id='test-button'>
                    <button  onClick={this.handleTestSubmit} className='btn brow'>Test Code</button>
                </div>
                <div id='submit-button'>
                    <button onClick={this.handleCodeSubmit} className='btn green'>Submit Code</button>
                </div>
            </div>
        }


        if(editor_language === null && editor_theme === null){
            this.props.setEditorOptions(
                {
                    editor_language : languages[1],
                    editor_theme : themes[9]
                }
            )
        }

        let question=null;
        let sample_input=null;
        let sample_output=null;
        if(this.props.current_question){
            question=this.props.current_question.question;

            let s_input=JSON.parse(this.props.current_question.sample_input);
            sample_input=s_input.map((input)=>{
                return (
                    <span key={input}>{input} </span>
                )
            });
            
            let s_output=JSON.parse(this.props.current_question.sample_output);
            sample_output=s_output.map((output)=>{
                return (
                    <span key={output}>{output} </span>
                )
            });
        }
        return (
            <div>
                <SelectOptions editor_theme={this.props.editor_theme} editor_language={this.props.editor_language} setEditorOptions={this.props.setEditorOptions} />
                <div className='col s12'>
                    <ul className="collection with-header">
                        <li className="collection-header"><h5>Question</h5></li>
                        <li className="collection-item">
                            <div>
                                <p>{question}</p>
                            </div>
                        </li>
                    </ul>
                    <ul className="collection with-header">
                        <li className="collection-header"><h5>Sample Input</h5></li>
                        <li className="collection-item">
                            <div>
                                {sample_input}
                            </div>
                        </li>
                    </ul>   

                    <ul className="collection with-header">
                        <li className="collection-header"><h5>Sample Output</h5></li>
                        <li className="collection-item">
                            <div>
                                {sample_output}
                            </div>
                        </li>
                    </ul>   

                </div>
                <AceEditor
                    mode={editor_language}
                    theme={editor_theme}
                    value={this.props.source_code}
                    onChange={this.onChange}
                    name="UNIQUE_ID_OF_DIV"
                    editorProps={{$blockScrolling: true}}
                    width='100%'
                    showPrintMargin={false}
                />
                 
                <div className='row'>
                    <div className='col offset-s1'>
                        <p>Click <span id='test-code'>Test Code</span> if you want to test your code before submitting it</p>
                    </div>
                </div>
                <div className='row'>
                    <div className='col s4 offset-s4'>
                        {button_holder}
                    </div>
                </div>

                <div className='row'>
                    {result_card}
                </div>
            </div>
        )
    }
}

class SelectOptions extends Component{
    constructor(props){
        super(props);
        this.handleLangSelectChange=this.handleLangSelectChange.bind(this);
        this.handleThemeSelectChange=this.handleThemeSelectChange.bind(this);
    }

    handleLangSelectChange(event){
        event.preventDefault();
        const theme=this.props.editor_theme;
        const lang=event.target.value;
        this.props.setEditorOptions({
            editor_language: lang,
            editor_theme: theme
        });
    }

    handleThemeSelectChange(event){
        event.preventDefault();
        const theme=event.target.value;
        const lang=this.props.editor_language;
        this.props.setEditorOptions(
            {
                editor_language: lang,
                editor_theme: theme
            }
        )
    }


    render(){
        const language_options=languages.map((language)=>{
            return(
                <option  ref={language} key={language} value={language}>{language}</option>
            )
        });

        const theme_options=themes.map((theme)=>{
            return (
                <option ref={theme} key={theme} value={theme}>{theme}</option>
            )
        })
        return (
            <div>
                <Input onChange={this.handleLangSelectChange} s={6} type='select' label="Select Language" defaultValue='python'>
                    {language_options}
                </Input>
                <Input onChange={this.handleThemeSelectChange} s={6} type='select' label='Select Theme' defaultValue='xcode'>
                   {theme_options}
                </Input>
           </div> 
        )
    }
}

const mapStatetoProps=(state)=>{
    return{
        current_question: state.setCurrentQuestion.current_question,
        editor_language: state.setEditorOptions.editor_language,
        editor_theme: state.setEditorOptions.editor_theme,
        source_code: state.setSourceCode.source_code,
        waiting_code_res: state.setWaitingCodeSubmission.waiting_code_res,
        messenger_id: state.setMessengerId.messenger_id,
        connected: state.facebookLogin.connected,
        user_information: state.setUserInformation.user_information,
        messenger_extensions: state.setMessengerExtensions.messenger_extensions,
        test_results: state.setTestResults.test_results
    }
}

const mapDispatchtoProps=(dispatch)=>{
    return (
        bindActionCreators(actions, dispatch)
    )
}

const CurrentQuestion=connect(mapStatetoProps, mapDispatchtoProps)(CQuestion)

export default CurrentQuestion;