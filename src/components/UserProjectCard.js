import React from 'react';
import viewButton from '../canvas_imgs/view-canvas.png'

const UserProjectCard = (props) =>{

    return (
        <div id={props.project.id}>
        <h2>{props.project.name}</h2>
            <img src={props.project.image} alt={props.project.id} width="500" height="600"></img>
            <p>{props.project.description}</p>
            <p> Likes:{props.project.likes.length}</p>
            <div id={props.project.id}>
                <button onClick={props.onHandleDeleteProject}>Delete</button>
                <img src={viewButton} onClick={props.onHandleViewProject} alt="view" width="32" height="32"></img>
                <button onClick={props.onHandleEditProject}>Edit</button>
            </div>
            
        </div>

    )
};

export default UserProjectCard;