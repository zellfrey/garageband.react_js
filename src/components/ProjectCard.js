import React from 'react';

const ProjectCard = (props) =>{
    return (
        <div id={props.project.id}>
            <h2>{props.project.name}</h2>
            <img src={props.project.image} alt={props.project.id} width="500" height="600"></img>
            <p>{props.description}</p>
            <p> Made by:{props.project.author.name}</p>
            <p> Likes:{props.project.likes.length}</p>
            <button onClick={props.onHandleLikeProject}>Like</button>
            <button onClick={props.onHandleViewProject}>View</button>
        </div>
    )
}

export default ProjectCard;