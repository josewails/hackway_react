/*global MessengerExtensions */
import React, {Component} from 'react';
import {Col,Card} from 'react-materialize';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import actions from '../../actions';


var request_promise=require('request-promise');

class PQExplanation extends Component{

    constructor(props){
        super(props);
        this.handleCloseWindow=this.handleCloseWindow.bind(this);
    }

    handleCloseWindow(){
        MessengerExtensions.requestCloseBrowser(function success() {
            console.log('closed');
          }, function error(err) {
             console.log(err);
          });
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
        const q_id=parseInt(this.props.question_id);
        const options={
            method: 'POST',
            uri: 'https://hackway.herokuapp.com/programming_question_explanation',
            form: {
                question_id: q_id
            }
        }

        request_promise(options).then(function(body){
            const res=JSON.parse(body)
            console.log(body)
            if(res.explanation){
                that.props.setProgrammingQuestionExplanation(res.explanation)
            }
            if(res.error){
                that.props.setProgrammingQuestionExplanation(res.explanation)
            }
        }).catch(function(err){
            console.log(err);
        })

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
        if(this.props.programming_question_explanation){
            return <div>
                <Col m={10} s={12}>
                        <Card className='white' title=''>
                            <p>{this.props.programming_question_explanation}</p>
                        </Card>
                </Col>
                <div className='row'>
                    <div className='col s10 offset-s1'>
                        <button onClick={this.handleCloseWindow.bind(this)} className='btn'>Got It </button>
                    </div>
                </div>
            </div>
        }
        else{
            return <div>
                <Col m={10} s={12}>
                        <Card className='white' title=''>
                            <p>Retrieving Explanation....</p>
                        </Card>
                </Col>
                <div className='row'>
                    <div className='col s10 offset-s1'>
                        <button onClick={this.handleCloseWindow.bind(this)} className='btn'>Got It </button>
                    </div>
                </div>
            </div>
        }
    } 
}


const mapStatetoProps=(state)=>{
    return{
        messenger_extensions: state.setMessengerExtensions.messenger_extensions,
        programming_question_explanation: state.setProgrammingQuestionExplanation.programming_question_explanation
    }
}

const mapDispatchtoProps=(dispatch)=>{
    return (
        bindActionCreators(actions, dispatch)
    )
}

const ProgrammingQuestionExplanation=connect(mapStatetoProps, mapDispatchtoProps)(PQExplanation)

export default ProgrammingQuestionExplanation;