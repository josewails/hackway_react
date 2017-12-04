import React, {Component}  from 'react'
import  { Col, Card } from 'react-materialize'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import actions from '../../actions';
import {Link} from 'react-router-dom';
import Progress from 'react-progressbar';
var request_promise=require('request-promise')


class RCard extends Component{

    componentDidMount(){
        const that=this;

        const messenger_id=that.props.messenger_id;
        const facebook_id=localStorage.getItem('facebook_id');

        //const messenger_id='1528075240606741'
        //const facebook_id='1091795360951693'

        if(facebook_id  & messenger_id){
            const options={
                method: 'POST',
                uri: 'https://hackway.herokuapp.com/get_individual_ranking',
                form: {
                    facebook_id: facebook_id,
                    messenger_id: messenger_id
                }
            }
    
            request_promise(options).then(function(body){
                body=JSON.parse(body);
                that.props.setIndividualRanking(body);
            }).catch(function(error){
                alert(error);
            })
        }
    }

    render(){

        if(!this.props.individual_ranking){
            return (
                <div>
                    <p>Ranking not retrieved</p>
                </div>
            )
        }
        return (
            <div>
                <Col m={6} s={12}>
                    <Card className='white'  title='Your Progress' actions={[<Link to='/full_ranking'>See LeaderBoard</Link>]}>
                     <h6>Quizes: {this.props.individual_ranking.quiz_score}%</h6>
                     <Progress completed={this.props.individual_ranking.quiz_score} />

                     <h6>Challenges: {this.props.individual_ranking.challenge_score}%</h6>
                     <Progress completed={this.props.individual_ranking.challenge_score} />

                     <h6>Overall: {this.props.individual_ranking.overall_score}%</h6>
                     <Progress completed={this.props.individual_ranking.overall_score} />
                    </Card>
                </Col>
            </div>
        )
    }
}

const mapStatetoProps=(state)=>{
    return{
        individual_ranking: state.setIndividualRanking.individual_ranking,
    }
}

const mapDispatchtoProps=(dispatch)=>{
    return (
        bindActionCreators(actions, dispatch)
    )
}

const RankingCard=connect(mapStatetoProps,mapDispatchtoProps)(RCard);


export default RankingCard;