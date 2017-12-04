import React , {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import actions from '../../actions';
import SingleQuestion from './SingleQuestion';
import FacebookLogin from '../home/FacebookLogin'


var request=require('request');

class DFilteredQuestions extends Component{

    componentWillMount(){
        const that=this;
        const difficulty_level=this.props.difficulty_level;
        const options={
            url : 'https://hackway.herokuapp.com/coding_questions/difficulty_level/'+difficulty_level
        }

        request.get(options, function(error, response, body){
            body=JSON.parse(body);
            that.props.setDifficultyFilteredQuestions(body);
        })        
    }
    
    render(){

        var connected=this.props.connected;
        
        console.log(connected);

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

        let questions=null;
        if(this.props.difficulty_filtered_questions){
            questions=this.props.difficulty_filtered_questions.map((question)=>{
                return (
                    <SingleQuestion key={question.id} question_id={question.id} title={question.title} question={question.question} />
                )
            })
        }
        console.log(questions);
        return (
            <div>
                {questions}
            </div>
        )
    }
}

const mapStatetoProps =(state)=> {
    return {
        difficulty_filtered_questions : state.setDifficultyFilteredQuestions.difficulty_filtered_questions,
        connected: state.facebookLogin.connected
    }
}

const mapDispatchtoProps= (dispatch)=>{
    return (
        bindActionCreators(actions, dispatch)
    )
}

const DifficultyFilteredQuestions =connect(mapStatetoProps, mapDispatchtoProps)(DFilteredQuestions)

export default DifficultyFilteredQuestions;



