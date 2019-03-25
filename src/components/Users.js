import React from 'react';
import UserPage from './UserPage'

export default class Users extends React.Component {

    renderSpecificUserPage =()=>{
        const SignedUser = this.props.filterSignedUser
        const userProjects = this.props.projects.filter(proj =>{return proj.author.id === SignedUser.id})

        return(<UserPage user={SignedUser} projects={userProjects}/>)
    }

render() {
        return (
          <div>
              {this.renderSpecificUserPage()}
          </div>
        )
    }
  }
