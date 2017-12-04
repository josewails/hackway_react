import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Col, CardPanel} from 'react-materialize';
import actions from '../../actions';
import {Link} from 'react-router-dom';

import FacebookLogin from '../home/FacebookLogin';
import '../home/MainLogin.css';

var request=require('request');

class ACodingResults extends Component{
    constructor(props){
        super(props);
        this.retrieveResultInfo=this.retrieveResultInfo.bind(this);
    }
    retrieveResultInfo(result){
        if(this.props.all_questions){
            const all_questions=this.props.all_questions;
            const current_question=all_questions.find((question) => question.id === result.question_solved_id);
            const testcases=JSON.parse(current_question.input);
            
    
            if(testcases.length === result.last_testcase_passed_index){
                return(
                    <div>
                            <Col s={12} m={5}>
                                <h5>Problem </h5>
                                <CardPanel className="white lighten-4 black-text">
                                    <p>{current_question.question}</p>
                                </CardPanel>
                            </Col>
                            <Col s={12} m={7}>
                                    <h5>Results</h5>
                                    <CardPanel className="green lighten-4 black-text">
                                        <p>Status: Success</p>
                                        <p>You passed all the testcases for this question</p>
                                        <Link className='btn green' to={'/result/'+this.props.facebook_id+'/'+current_question.id}>Full Result</Link>
                                    </CardPanel>
                            </Col>
                        <hr />
                    </div>
                )
            }
            else{
                const failed_testcase=testcases[result.last_testcase_passed_index];
                return(
                    <div>
                            <Col s={12} m={5}>
                                    <h5>Problem</h5>
                                    <CardPanel className="white lighten-4 black-text">
                                        <p>{current_question.question}</p>
                                    </CardPanel>
                                    
                            </Col>
                            <Col s={12} m={7}>
                                    <h5>Results</h5>
                                    <CardPanel className="red lighten-4 black-text">
                                        <p>status: Failed</p>
                                        <p>Your code failed for this testcase: </p>
                                        <p>{failed_testcase}</p>
                                        <Link className='btn red' to={'/result/'+this.props.facebook_id+'/'+current_question.id}>Full Result</Link>   
                                    </CardPanel>
                            </Col>
                        <hr />
                    </div>
                )
            }
        }
        else{
            return (
                <div>We experience some problem</div>
            )
        }
    }

    componentWillMount(){
        const that=this;
        const facebook_id=this.props.facebook_id;

        const options={
            url: 'https://hackway.herokuapp.com/coding_questions'
        }

        request.get(options, function(error, response, body){
            body=JSON.parse(body);
            that.props.setAllQuestions(body);
        })
        
        const result_options={
            url: 'https://hackway.herokuapp.com/coding_results/'+ facebook_id
        }

        request.get(result_options, function(error, response, body){
            body=JSON.parse(body);
            that.props.setAllCoderResults(body);
        })

    }
    render(){
        let all_coder_results=this.props.all_coder_results;
        let coder_results_cards=null;

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

        if(all_coder_results){
            coder_results_cards=all_coder_results.map((result)=>{
                return this.retrieveResultInfo(result);
            })
        }
        return (
        <div>
            <div>
                {coder_results_cards}
            </div>
        </div>)
    }
}

const mapStatetoProps=(state)=>{
    return{
        all_questions: state.setAllQuestions.all_questions,
        all_coder_results: state.setAllCoderResults.all_coder_results,
        connected : state.facebookLogin.connected
    }
}

const mapDispatchtoProps=(dispatch)=>{
    return (
        bindActionCreators(actions, dispatch)
    )
}

const AllCodingResults=connect(mapStatetoProps, mapDispatchtoProps)(ACodingResults)

export default AllCodingResults;