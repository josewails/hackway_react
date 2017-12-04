const initialState={
    all_courses: {
        courses: []
    }
}

const setAllCourses=(state=initialState, action)=>{
    switch(action.type){
        case 'set_all_courses':
            return {
                all_courses : action.payload
            }

        default:
            return state
    }
}

export default setAllCourses;