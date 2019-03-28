import React from 'react';
import viewButton from '../canvas_imgs/view-canvas.png'
import likeGreyButton from '../canvas_imgs/like-grey.png'
import placeholderImg from '../canvas_imgs/placeholder_img.jpg'

const ProjectCard = (props) =>{
    return (
        <div className='projectCard' id={props.project.id}>
            <h2>{props.project.name}</h2>
            <img src={placeholderImg} alt={props.project.id} width="180" height="140"></img>
            <p> Made by:{props.project.author.name}</p>
            <p> Likes:{props.project.likes.length}</p>
            <p>{props.project.description}</p>
            <div id={props.project.id}>
            <img src={likeGreyButton} onClick={props.onHandleLikeProject} alt="like" id="like" width="32" height="32"></img>
                <img src={viewButton} onClick={props.onHandleViewProject} alt="view" id="view" width="32" height="32"></img>
            </div>
        </div>
    )
}

export default ProjectCard;