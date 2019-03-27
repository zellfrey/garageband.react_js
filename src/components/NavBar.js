import React from 'react';
import { NavLink } from 'react-router-dom';


const NavBar = (props) =>{
    return(
    <div className="ui inverted menu">
        <NavLink className='item' to="/" >Home</NavLink>
        <NavLink className='item' to="/create" >Create</NavLink>
        <NavLink className='item' to="/collection" >Collection</NavLink>
        <div className="right menu">
        <div className='item'  onClick={props.renderUserPage} >User</div>
    </div>
    </div>
    );
};

export default NavBar;