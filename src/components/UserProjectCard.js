import React from 'react';

export default class UserProjectCard extends React.Component{

    render(){
        return (
            <div id={this.props.project.id}>
            <h2>{this.props.project.name}</h2>
                <img src={this.props.project.image} alt={this.props.project.id} width="500" height="600"></img>
                <p>{this.props.description}</p>
                <p> Made by:{this.props.project.author.name}</p>
                <p> Likes:{this.props.project.likes.length}</p>
            <button onClick={this.props.onHandleDeleteProject} id={this.props.project.id}>Delete</button>
            <button onClick={this.props.onHandleViewProject} id={this.props.project.id}>View</button>
            </div>

        )
    }
}