import {combineReducers} from 'redux';
import facebookLogin from './loginReducer';
import setFacebookId from './setFacebookId';
import setUserInformation from './setUserInformation';
import setAllQuestions from './setAllQuestions';
import setCurrentQuestion from './setCurrentQuestion';
import setEditorOptions from './setEditorOptions';
import setSourceCode from './setSourceCode';
import setAllCoderResults from './setAllCoderResults';
import setRetrievedResult from './setRetrievedResult';
import   setDifficultyFilteredQuestions from './setDifficultyFilteredQuestions';
import setWaitingCodeSubmission from './setWaitingCodeSubmission';
import setCurrentResult from './setCurrentResult';
import setMessengerId from  './setMessengerId'
import setIndividualRanking from './setIndividualRanking';
import setAllRanking from './setAllRanking';
import setMessengerExtensions from './setMessengerExtensions';
import setProgrammingQuestionExplanation from './setProgrammingQuestionExplanation';
import setCodingGroundResults from './setCodingGroundResults';
import setTestResults from './setTestResults';
import setAllCourses from './setAllCourses';
import setCourseData from './setCourseData'
import setCourseSegmentData from './setCourseSegmentData'

const rootReducer=combineReducers(
    {
        facebookLogin,
        setFacebookId,
        setUserInformation,
        setAllQuestions,
        setCurrentQuestion,
        setEditorOptions,
        setSourceCode,
        setAllCoderResults,
        setRetrievedResult,
        setDifficultyFilteredQuestions,
        setWaitingCodeSubmission,
        setCurrentResult,
        setMessengerId,
        setIndividualRanking,
        setAllRanking,
        setMessengerExtensions,
        setProgrammingQuestionExplanation,
        setCodingGroundResults,
        setTestResults,
        setAllCourses,
        setCourseData,
        setCourseSegmentData
    }
)

export default rootReducer