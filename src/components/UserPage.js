import React from 'react';
import UserProjectCard from './UserProjectCard'

export default class UserPage extends React.Component{

    renderProjectCard = () =>{
        this.props.projects.map((proj, idx) =>{return <UserProjectCard key={idx}project={proj}/>})
    }

    render (){
        return(
        <div>
            <div>
                <h3>{this.props.user.name}</h3>
                <h3>{this.props.user.email}</h3>
                <img src={this.props.user.profile} alt="oopsie whoopsie"width="200" height="200"></img>
            </div>
                {this.renderProjectCard()}
            <div>
            </div>
        </div>
        )
    }
}