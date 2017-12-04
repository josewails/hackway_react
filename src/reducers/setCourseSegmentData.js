const initial_state={
    course_segment_data: null
}

const setCourseSegmentData = (state=initial_state, action)=>{
    switch(action.type){
        case 'set_course_segment_data':
            return {
                course_segment_data: action.payload
            }
        default:
            return state
    }
}

export default setCourseSegmentData;