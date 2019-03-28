import React from 'react';
import viewButton from '../canvas_imgs/view-canvas.png'
import editButton from '../canvas_imgs/edit-button.png'
import placeholderImg from '../canvas_imgs/placeholder_img.jpg'

const UserProjectCard = (props) =>{

    return (
        <div id={props.project.id}>
        <h2>{props.project.name}</h2>
            <img src={placeholderImg} alt={props.project.id} width="180" height="140"></img>
            <p>{props.project.description}</p>
            <p> Likes:{props.project.likes.length}</p>
            <div id={props.project.id}>
                <button onClick={props.onHandleDeleteProject}>Delete</button>
                <img src={viewButton} onClick={props.onHandleViewProject} alt="view" width="32" height="32"></img>
                <img src={editButton} onClick={props.onHandleEditProject} alt="view" width="32" height="32"></img>
            </div>
            
        </div>

    )
};

export default UserProjectCard;