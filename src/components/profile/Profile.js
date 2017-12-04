import React ,{Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import actions from '../../actions';
import {Link} from 'react-router-dom';
import FacebookLogin from '../home/FacebookLogin'
import './Profile.css';
import '../home/MainLogin.css'

const request= require('request')

class UserProfile extends Component{
    constructor(props){
        super(props);
        this.generalInformation=this.generalInformation.bind(this);
    }

    generalInformation(){
        const facebook_id=localStorage.getItem('facebook_id');
        var that=this;

        if(facebook_id === 'null'){
            console.log('this must not be null');
        }else{
            //get the current user
            const url='https://hackway.herokuapp.com/facebook_users/'+facebook_id
            const options={
                url: url
            }
            request.get(options, function(error, response, body){
                body=JSON.parse(body);
                that.props.setUserInformation(body);
            })
        }
    }


    componentWillMount(){
        this.generalInformation();
    }

    render(){

        if(!this.props.connected){
            return (
                <div className="row center">
                    <div id='fb-button-holder' className="col s8 offset-s2">
                        <p>You have to login with facebook first</p>
                        <FacebookLogin />
                    </div>
                </div>
            )
        }
        let user_name=null;
        let user_email=null;
        let profile_picture=null;
        if(this.props.user_information){
            user_name =this.props.user_information.name;
            profile_picture=this.props.user_information.profile_picture_url
        }



        return (
            <div>
                <div className="card">
                    <div className="card-content">
                      <div className="col s4 card-image waves-effect waves-block waves-light">
                        <img alt='' className="circle responsive-img" src={profile_picture} />
                      </div>   
                     <p>Users Bio will go here :D</p>
                    </div>
                    <div className="card-tabs">
                    <ul className="tabs tabs-fixed-width">
                        <li className="tab"><Link to="#g-info">General Information</Link></li>
                    </ul>
                    </div>
                    <div className="card-content grey lighten-4">
                        <div id="g-info">
                         <p>Name: {user_name}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStatetoProps= (state)=>{
    return{
        user_information: state.setUserInformation.user_information,
        connected: state.facebookLogin.connected
    }
}

const mapDispatchtoProps= (dispatch) =>{
    return (
        bindActionCreators(actions, dispatch)
    );
}

const Profile = connect(mapStatetoProps, mapDispatchtoProps)( UserProfile);

export default Profile;