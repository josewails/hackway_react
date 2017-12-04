import React, {Component} from 'react';
import {Link} from 'react-router-dom'

class SingleQuestion extends Component{
    render(){
        console.log(this.props.question_id);
        return (
            <div className="row">
                <div className="col s12">
                <div className="card blue-grey darken-1">
                    <div className="card-content white-text">
                    <span className="card-title">{this.props.title}</span>
                    <p>{this.props.question}</p>
                    </div>
                    <div className="card-action">
                        <Link to={"/all_coding_questions/"+this.props.question_id}>Solve</Link>
                    </div>
                </div>
                </div>
            </div>
        )
    }
}

export default SingleQuestion;