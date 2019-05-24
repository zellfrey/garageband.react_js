import React from 'react';
import { NavLink } from 'react-router-dom';
import '../NavBar.css';


const NavBar = (props) =>{
    return(
        <div className='Navbar'>
        <NavLink to="/" id='NavLeftItem'>Home</NavLink>
        <NavLink to="/create" id='NavLeftItem'>Create</NavLink>
        <NavLink to="/collection" id='NavLeftItem'>Collection</NavLink>
        <NavLink to={`/users/${props.loggedUser}`} className ='NavBarUser'>User</NavLink>
    </div>
    );
};

export default NavBar;