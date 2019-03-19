import React from 'react';
import { NavLink } from 'react-router-dom';


const NavBar = () =>{
    return(
    <div className="ui inverted menu">
        <NavLink className='item' to="/" >Home</NavLink>
        <NavLink className='item' to="/create" >Create</NavLink>
        <NavLink className='item' to="/collection" >Collection</NavLink>
        <div className="right menu">
        {/* <a className="item">Sign Up</a>
        <a className="item">Help</a> */}
    </div>
    </div>
    );
};

export default NavBar;