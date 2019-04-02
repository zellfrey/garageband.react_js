import React from 'react';
import { NavLink } from 'react-router-dom';


const NavBar = (props) =>{
    return(
    <div>
        <NavLink to="/" >Home</NavLink>
        <NavLink to="/create" >Create</NavLink>
        <NavLink to="/collection" >Collection</NavLink>
        <div>
        <div  onClick={props.renderUserPage} >User</div>
    </div>
    </div>
    );
};

export default NavBar;