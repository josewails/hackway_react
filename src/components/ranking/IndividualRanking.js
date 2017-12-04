/* global MessengerExtensions */
import React , {Component} from 'react';
import RankingCard from './RankingCard';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import actions from '../../actions';
import FacebookLogin from '../home/FacebookLogin';
import '../home/MainLogin.css';

const request_promise=require('request-promise');

class IRanking extends Component{

    componentDidMount(){
        const that=this;
    
        window.extAsyncInit = function() {
            MessengerExtensions.getContext('138163653574762', 
                function success(thread_context){
                    that.props.setMessengerId(thread_context.psid);
                },
                function error(err){
                    console.log(err);      
                }
            );
        };
    }

    componentWillMount(){
    
        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.com/en_US/messenger.Extensions.js";
            fjs.parentNode.insertBefore(js, fjs);
          }(document, 'script', 'Messenger'));

    }
    render(){
        const connected=this.props.connected;
        

        if(!connected){
           return (
                <div className="row center">
                    <div id='fb-button-holder' className="col s8 offset-s2">
                        <p>You have to login with facebook first</p>
                        <FacebookLogin />
                    </div>
                </div>
           )             
        }
        
        if(this.props.messenger_id){
            return (
                <div>
                    <RankingCard messenger_id={this.props.messenger_id} />
                </div>
            )
        }

        else{
            return (
                <div>Nothing retreived</div>
            )
        }
        
    }
}

const mapStatetoProps=(state)=>{
    return{
        messenger_id: state.setMessengerId.messenger_id,
        connected : state.facebookLogin.connected
    }
}

const mapDispatchtoProps=(dispatch)=>{
    return (
        bindActionCreators(actions, dispatch)
    )
}

const IndividualRanking=connect(mapStatetoProps,mapDispatchtoProps)(IRanking);

export default IndividualRanking;