import React from 'react';

export default class CanvasCard extends React.Component{
    render(){
        return (
            <div id={this.props.project.id}>
                <img src={this.props.project.image} alt={this.props.project.id} width="500" height="600"></img>
                <h2>{this.props.project.name}</h2>
            </div>
        )
    }
}