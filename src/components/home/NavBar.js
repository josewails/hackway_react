import React, {Component} from 'react';
import {SideNav, SideNavItem, Icon} from 'react-materialize';

class NavBar extends Component{
    render()
    {
        const facebook_id=localStorage.getItem('facebook_id');
        return (
            <SideNav
                trigger={<a href='#'><Icon medium>menu</Icon></a>}
                options={{ closeOnClick: true }}>
            <SideNavItem href='/'>Home</SideNavItem> 
            <SideNavItem href='/individual_ranking'>My Progress</SideNavItem>   
            <SideNavItem href={'/coding_results/'+facebook_id}>Your Results</SideNavItem>
            <SideNavItem waves href="/all_coding_questions">All Questions</SideNavItem>
            <SideNavItem waves href="/profile">My Profile</SideNavItem>
            <SideNavItem waves href='/coding_ground'>Coding Ground </SideNavItem>
            </SideNav>
        )
    }
}

export default NavBar;