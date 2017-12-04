const initial_state={
    'course_data': null
}

const setCourseData = (state=initial_state, action)=>{
    switch(action.type){
        case 'set_course_data':
            return {
                'course_data': action.payload
            }
        default:
            return state
    }
}

export default setCourseData;