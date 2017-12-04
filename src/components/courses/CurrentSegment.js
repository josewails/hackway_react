import React , {Component} from 'react';
import {connect}  from 'react-redux';
import {bindActionCreators}  from 'redux';
import actions from '../../actions';
import {Col, Preloader, ProgressBar, Card} from 'react-materialize';

const request_promise=require('request-promise');

class CSegment extends Component{

    componentWillMount(){
        const that=this;

        const options={
            method: 'POST',
            uri: 'http://hackway.herokuapp.com/course_segment_details',
            form: {
                segment_id: this.props.segment_id
            }
        }

        request_promise(options).then(function(body){
            that.props.setCourseSegmentData(JSON.parse(body));
        }).catch(function(error){
            alert(error);
        })
    }
    render(){

        if(this.props.course_segment_data){
            const course_segment=this.props.course_segment_data;
            return (
                <div>
                    <h5>{course_segment.title}</h5>
                    <h6><emp>{course_segment.intro}</emp></h6>
                    <p dangerouslySetInnerHTML={{__html: course_segment.body}} />
                    <a href="#" className='btn'>Solve Quiz</a>
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
        course_segment_data: state.setCourseSegmentData.course_segment_data
    }
}

const mapDispatchtoProps=(dispatch)=>{
    return (
        bindActionCreators(actions, dispatch)
    )
}

const CurrentSegment=connect(mapStatetoProps, mapDispatchtoProps)(CSegment);
export default CurrentSegment;