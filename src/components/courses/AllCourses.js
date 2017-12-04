import React, {Component} from 'react';
import {connect}  from 'react-redux';
import {bindActionCreators} from 'redux';
import {Card, CardTitle} from 'react-materialize'

import actions from '../../actions'

const request_promise=require('request-promise')

class ACourses extends Component{
    componentWillMount(){
        const that=this;
        const options={
            uri: 'http://hackway.herokuapp.com/get_all_courses',
            method: 'GET'
        }

        request_promise(options).then(function(body){
            that.props.setAllCourses(JSON.parse(body));
        }).catch(function(error){
            console.log(error);
        });
    }
    render(){

        const courses=this.props.all_courses.courses
        const courses_cards=courses.map((course, i)=>{
            return (
                <div className='col s12 m6 l4' key={i}>
                    <Card header={<CardTitle reveal image={"https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Python.svg/2000px-Python.svg.png"} waves='light'/>}
                            title={course.name}
                            reveal={<p>{course.description}</p>}>
                            <p><a href="#">See Course</a></p>
                    </Card>
                </div>
            )
        });

    
        return (
            <div>
                {courses_cards}
            </div>
        )
    }
}

const mapStatetoProps=(state) =>{
    return{
        all_courses: state.setAllCourses.all_courses
    }
}

const mapDispatchtoProps=(dispatch)=>{
    return (
        bindActionCreators(actions, dispatch)
    )
}

const AllCourses=connect(mapStatetoProps, mapDispatchtoProps)(ACourses);

export default AllCourses;