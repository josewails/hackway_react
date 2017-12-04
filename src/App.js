import React, {Component} from 'react';
import {NavBar, 
    MainLogin,
    Profile, 
    AllQuestions,
    CurrentQuestion,
    AllCoderResults,
    RetrievedResult,
    DifficultyFilteredQuestions,
    IndividualRanking,
    FullRanking,
    QuestionShare,
    ResultShare,
    ProgrammingQuestionExplanation,
    CodingGround,
    AllCourses,
    CurrentCourse,
    CurrentSegment} from './components'

 import {Switch, Route} from 'react-router-dom'

class App extends Component{
    render(){
        return (
            <div>
                <MainRouters />
            </div>
        );
    }
}

class MainRouters extends Component{
    render(){
        return (
            <div>
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route exact path='/profile/' component={UserProfile} /> 
                    <Route exact path='/all_coding_questions/' component={CodingQuestions} />
                    <Route exact path='/all_coding_questions/:num/' component={QuestiontoSolve} />
                    <Route exact path='/coding_results/:facebook_id/' component={CoderResultList} />
                    <Route exact path='/result/:facebook_id/:question_id/'  component={CodingResult}/>
                    <Route exact path='/individual_ranking/' component={IndieRanking} />
                    <Route exact path='/all_coding_questions/difficulty_level/:difficulty_level/' component={DFQuestions} />
                    <Route exact path='/full_ranking' component={FRanking} />
                    <Route exact path='/question_share/:num' component={QuShare} />
                    <Route exact path='/result_share/:facebook_id/:question_id/' component={ReShare} />
                    <Route exact path='/programming_question_explanation/:question_id'  component={PQuestionExplanation} />
                    <Route exact path='/coding_ground' component={CodingG} />
                    <Route exact path='/all_courses' component={ACourses} />
                    <Route exact path='/all_courses/:course_id' component={CCourse} />
                    <Route exact path='/course_segments/:segment_id' component={CSegment} />
                </Switch>
            </div>
        )
    }
}

class Home extends Component{
    render(){
        return(
            <div>
               <NavBar />
               <MainLogin />
            </div>
        )
    }
}

class UserProfile extends Component{
    render(){
        return (
            <div>
                <NavBar />
                <div className='container'>
                    <div className='row'>
                        <div className='col s10'>
                            <Profile />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class CodingQuestions extends Component{
    render(){
        return (
            <div>
                <NavBar />
                <div className='container'>
                    <div className='row'>
                        <div className='col s10'>
                            <AllQuestions />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class QuestiontoSolve extends Component{
    render(){
        return (
            <div>
                <NavBar />
                    <div className='container'>
                        <div className='row'>
                            <div className='col s12'>

                            </div>
                        </div>
                        <div className='row'>
                            <div className='col s12'>
                                <CurrentQuestion  question_id={this.props.match.params.num}/>
                            </div>
                        </div>
                    </div>
            </div>
        )
    }
}

class CoderResultList extends Component{
    render(){
        return (
            <div>
                <NavBar />
                <div className='container'>
                    <div className='row'>
                       <AllCoderResults facebook_id={this.props.match.params.facebook_id}/>
                    </div>
                </div>
            </div>
        )
    }
}

class CodingResult extends Component{
    render(){
        return (
            <div>
                <NavBar />
                 <div className='container'>
                    <div className='row'>
                        <RetrievedResult facebook_id={this.props.match.params.facebook_id} question_id={this.props.match.params.question_id} />
                    </div>
                </div>
            </div>
           
        )
    }   
}

class DFQuestions extends Component{
    render(){
        return (
            <div>
                <NavBar />
                <div className='container'>
                    <div className='row'>
                        <div className='col s10'>
                            <DifficultyFilteredQuestions  difficulty_level={this.props.match.params.difficulty_level}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class IndieRanking extends Component{
    render(){
        return (
            <div>
                 <NavBar />
                <div className='container'>
                    <div className='row'>
                        <div className='col s10 offset-s1'>
                            <IndividualRanking />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class FRanking extends Component{
    render(){
        return (
            <div>
                <NavBar />
                <div className='container'>
                    <div className='row'>
                        <div className='col s10 offset-s1'>
                            <FullRanking />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class QuShare extends Component{
    render(){
        return (
            <div>
                <NavBar />
                <div className='container'>
                    <div className='row'>
                        <div className='col s10 offset-1'>
                            <QuestionShare  question_id={this.props.match.params.num}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class ReShare extends Component{
    render(){
        return (
            <div>
                <NavBar />
                <div className='container'>
                    <div classsName='col s10 offset-1'>
                        <ResultShare question_id={this.props.match.params.question_id}  facebook_id={this.props.match.params.facebook_id} />
                    </div>
                </div>
            </div>
        )
    }
}

class PQuestionExplanation extends Component{
    render(){
        return (
        <div>
            <div className='container'>
                <div className='row'>
                    <div className='col s10 offset-1'>
                        <ProgrammingQuestionExplanation question_id={this.props.match.params.question_id}/>
                    </div>
                </div>
            </div>
        </div>
        )     
    }
}


class CodingG extends Component{
    render(){
        return (
            <div>
                <NavBar />
                <div className='container'>
                    <div className='row'>
                        <div className='col s12'>
                            <CodingGround />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class ACourses extends Component{
    render(){
        return (
            <div>
                <div className='container'>
                    <div className='row'>
                        <div className='col s12'>
                            <AllCourses />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class CCourse extends Component{
    render(){
        return (
            <div className='container'>
                <div className='row'>
                    <div className='col s12'>
                        <CurrentCourse  course_id={this.props.match.params.course_id} />
                    </div>
                </div>
            </div>
        )
    }
}

class CSegment extends Component{
    render(){
        return (
            <div className='container'>
                <div className='row'>
                    <div className='col s12'>
                        <CurrentSegment  segment_id={this.props.match.params.segment_id} />
                    </div>
                </div>
            </div>
        )
    }
}

export default  App;