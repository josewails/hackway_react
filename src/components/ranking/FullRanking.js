import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import actions from '../../actions';
import FacebookLogin from '../home/FacebookLogin';
import {Col, Card} from 'react-materialize';
import Progress from 'react-progressbar';

const request_promise=require('request-promise');

class FRanking extends Component{
    componentWillMount(){
        const that=this;

        const options={
            method: 'GET',
            uri: 'https://hackway.herokuapp.com/get_all_rankings'
        }

        request_promise(options).then(function(body){
            that.props.setAllRanking(JSON.parse(body))
        }).catch(function(error){
            alert(error);
        })
    }
    render(){
        if (!this.props.connected){
            return (
                <div className="row center">
                    <div id='fb-button-holder' className="col s8 offset-s2">
                        <p>You have to login with facebook first</p>
                        <FacebookLogin />
                    </div>
                </div>
            )
        }

        if (this.props.all_ranking){
            const all_ranking_cards=this.props.all_ranking.reverse().map((ranking, index)=>{
                console.log('here');
                return (
                    <RCard key={index} current_ranking={ranking} />
                )
            });

            return (
                <div>
                    {all_ranking_cards}
                </div>
            )
            
        }

        else{
            return (
                <div>
                    <p>Loading</p>
                </div>
            )
        }
    }
}


class RCard extends Component{
    render(){
        const title=this.props.current_ranking.name;
        return (
            <div>
                <Col m={6} s={12}>
                <Card className='white'  title={title} actions={[<a href='#'>See LeaderBoard</a>]}>
                    <h6>Quizes: {this.props.current_ranking.ranking.quiz_score}%</h6>
                    <Progress completed={this.props.current_ranking.ranking.quiz_score} />

                    <h6>Challenges: {this.props.current_ranking.ranking.challenge_score}%</h6>
                    <Progress completed={this.props.current_ranking.ranking.challenge_score} />

                    <h6>Overall: {this.props.current_ranking.ranking.overall_score}%</h6>
                    <Progress completed={this.props.current_ranking.ranking.overall_score} />
                    </Card>
                </Col>
            </div>
        )
    }
}


const mapStatetoProps=(state)=>{
    return{
        connected : state.facebookLogin.connected,
        all_ranking: state.setAllRanking.all_ranking
    }
}

const mapDispatchtoProps=(dispatch)=>{
    return (
        bindActionCreators(actions, dispatch)
    )
}

const FullRanking=connect(mapStatetoProps, mapDispatchtoProps)(FRanking);

export default FullRanking;