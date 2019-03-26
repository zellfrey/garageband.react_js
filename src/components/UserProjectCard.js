import React from 'react';

const UserProjectCard = (props) =>{

    return (
        <div id={props.project.id}>
        <h2>{props.project.name}</h2>
            <img src={props.project.image} alt={props.project.id} width="500" height="600"></img>
            <p>{props.description}</p>
            <p> Likes:{props.project.likes.length}</p>
        <button onClick={props.onHandleDeleteProject} id={props.project.id}>Delete</button>
        <button onClick={props.onHandleViewProject} id={props.project.id}>View</button>
        </div>

    )
};

export default UserProjectCard;