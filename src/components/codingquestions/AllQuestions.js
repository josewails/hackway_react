import React , {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import actions from '../../actions';
import SingleQuestion from './SingleQuestion';


var request=require('request');

class Questions extends Component{

    componentWillMount(){
        const that=this;
        const options={
            url : 'https://hackway.herokuapp.com/coding_questions'
        }

        request.get(options, function(error, response, body){
            body=JSON.parse(body);
            that.props.setAllQuestions(body);
        })        
    }
    
    render(){
        let questions=null;
        if(this.props.all_questions){
            questions=this.props.all_questions.map((question)=>{
                return (
                    <SingleQuestion key={question.id} question_id={question.id} title={question.title} question={question.question} />
                )
            })
        }
        return (
            <div>
                {questions}
            </div>
        )
    }
}

const mapStatetoProps =(state)=> {
    return {
        all_questions : state.setAllQuestions.all_questions
    }
}

const mapDispatchtoProps= (dispatch)=>{
    return (
        bindActionCreators(actions, dispatch)
    )
}

const AllQuestions =connect(mapStatetoProps, mapDispatchtoProps)(Questions)

export default AllQuestions;



