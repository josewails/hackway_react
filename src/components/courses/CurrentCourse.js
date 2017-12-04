import React , {Component} from 'react';
import {connect}  from 'react-redux';
import {bindActionCreators}  from 'redux';
import actions from '../../actions';
import {Col, Preloader, ProgressBar, Card} from 'react-materialize';

const request_promise=require('request-promise');

class CCourse extends Component{

    componentWillMount(){
        const that=this;

        const options={
            method: 'POST',
            uri: 'http://hackway.herokuapp.com/course_details',
            form: {
                course_id: this.props.course_id
            }
        }

        request_promise(options).then(function(body){
            that.props.setCourseData(JSON.parse(body));
        }).catch(function(error){
            alert(error);
        })
    }
    render(){
        if(this.props.course_data){
            const course_data=this.props.course_data
            const course_segments=course_data.course_segments.map((segment, id)=>{
                return (
                    <Col key={id} m={6} s={12}>
                            <Card className='green-grey darken-1' textClassName='black-text' title={segment.title} actions={[<a href='#'>Read</a>]}>
                                  {segment.intro}
                            </Card>
                    </Col>
                )
            });
            return (
                <div>
                    <h5><strong>Course Name</strong>: {course_data.name}</h5>
                    <p><strong>Description </strong>: {course_data.description}</p>
                    <div>
                        {course_segments}
                    </div>
                </div>
            )
        }

        else{
            return (
                <div>
                    <Col s={12}>
                        <ProgressBar />
                    </Col>
                </div>
            )
        }
    }
}

const mapStatetoProps=(state)=>{
    return {
        course_data: state.setCourseData.course_data
    }
}

const mapDispatchtoProps=(dispatch)=>{
    return (
        bindActionCreators(actions, dispatch)
    )
}

const CurrentCourse=connect(mapStatetoProps, mapDispatchtoProps)(CCourse);
export default CurrentCourse;