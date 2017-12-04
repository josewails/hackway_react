/*global MessengerExtensions */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Input, Preloader, Chip,Col, CardPanel} from 'react-materialize';
import FacebookLogin from '../home/FacebookLogin';
import actions from '../../actions';
import './CodingGround.css';


import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/jsx';
import 'brace/ext/language_tools';
import 'brace/ext/searchbox';

import '../home/MainLogin.css';

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


class CGround extends Component{
    constructor(props){
        super(props);
        this.onChange=this.onChange.bind(this);
        this.handleCodeSubmit=this.handleCodeSubmit.bind(this);
    }

    onChange(newValue){
       this.props.setSourceCode(newValue);
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
            uri: 'https://hackway.herokuapp.com/check_ground_code',
            method: 'POST',
            form : {
                source_code: this.props.source_code,
                language_used: this.props.editor_language,
                testcases:JSON.stringify(['1'])
            }
        }

        request_promise(options).then(function(data){
            that.props.setCodingGroundResults(JSON.parse(data));
            that.props.setWaitingCodeSubmission(false);
        }).catch(function(error){
            console.log(error);
            that.props.setWaitingCodeSubmission(false);
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
        const coding_results=this.props.coding_ground_results;
        let result_card=null;
        var connected=this.props.connected;
        let button_holder=null

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

        if(this.props.waiting_code_res){
            button_holder=<div id='preloader-holder'>
                <Preloader size='small'/>
            </div>
        }else{
            button_holder=<div>
                <div id='submit-button'>
                    <button onClick={this.handleCodeSubmit} className='btn green'>Run Code</button>
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


        if(coding_results){
            console.log(coding_results);
            if(coding_results.success === true){
                result_card=<div>
                    <Col s={12} m={12} l={12}>
                            <CardPanel className="green lighten-4 black-text">
                                    <h5 className='red-text'>Output</h5>
                                    <p>{coding_results.result}</p>
                            </CardPanel>
                    </Col>
                </div>
            }
            else{
                result_card=<div>
                    <Col s={12} m={12} l={12}>
                            <CardPanel className="red lighten-4 black-text">
                                    <h5 className='red-text'>Message</h5>
                                    <p>{coding_results.message}</p>
                                    <h5>Error</h5>
                                    <p>{coding_results.error}</p>
                            </CardPanel>
                    </Col>
                </div>
            }
        }

        return (
            <div>
                <SelectOptions editor_language={this.props.editor_language} editor_theme={this.props.editor_theme} setEditorOptions={this.props.setEditorOptions} />
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
                    <div className='col s4 offset-s4'>
                        {button_holder}
                    </div>
                </div>

                <div id='coding-output' className='row'>
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
        console.log(this.props.editor_language);
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
        editor_language: state.setEditorOptions.editor_language,
        editor_theme: state.setEditorOptions.editor_theme,
        source_code: state.setSourceCode.source_code,
        waiting_code_res: state.setWaitingCodeSubmission.waiting_code_res,
        messenger_id: state.setMessengerId.messenger_id,
        connected: state.facebookLogin.connected,
        user_information: state.setUserInformation.user_information,
        messenger_extensions: state.setMessengerExtensions.messenger_extensions,
        coding_ground_results: state.setCodingGroundResults.coding_ground_results
    }
}

const mapDispatchtoProps=(dispatch)=>{
    return (
        bindActionCreators(actions, dispatch)
    )
}

const CodingGround=connect(mapStatetoProps, mapDispatchtoProps)(CGround)

export default CodingGround;